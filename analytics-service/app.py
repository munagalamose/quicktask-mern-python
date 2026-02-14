import os
from datetime import datetime, timedelta
from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()
app = Flask(__name__)
CORS(app, origins='*', allow_headers=['Content-Type', 'X-User-Id'])

MONGODB_URI = os.getenv('MONGODB_URI', 'mongodb://localhost:27017/quicktask')
client = MongoClient(MONGODB_URI)
db = client.get_database()


def get_tasks_collection():
    return db.tasks


def validate_user_id():
    """Expect X-User-Id header with MongoDB ObjectId for the authenticated user."""
    user_id = request.headers.get('X-User-Id')
    if not user_id or len(user_id) != 24:
        return None
    try:
        from bson import ObjectId
        return ObjectId(user_id)
    except Exception:
        return None


@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok', 'service': 'QuickTask Analytics'})


# Endpoint 1: User stats - total, completed, pending, priority distribution, completion rate
@app.route('/api/analytics/user-stats', methods=['GET'])
def user_stats():
    """Requires header: X-User-Id (MongoDB ObjectId)."""
    user_id = validate_user_id()
    if user_id is None:
        return jsonify({'error': 'Valid X-User-Id header required'}), 401

    tasks_coll = get_tasks_collection()
    pipeline = [
        {'$match': {'userId': user_id}},
        {
            '$facet': {
                'by_status': [
                    {'$group': {'_id': '$status', 'count': {'$sum': 1}}}
                ],
                'by_priority': [
                    {'$group': {'_id': '$priority', 'count': {'$sum': 1}}}
                ],
                'totals': [
                    {'$count': 'total'},
                    {'$addFields': {'completed': {'$literal': None}}}
                ]
            }
        }
    ]
    result = list(tasks_coll.aggregate(pipeline))
    if not result:
        return jsonify({
            'totalTasks': 0,
            'byStatus': {},
            'byPriority': {},
            'completedCount': 0,
            'pendingCount': 0,
            'completionRate': 0.0,
        })

    by_status = {r['_id']: r['count'] for r in result[0]['by_status']}
    by_priority = {r['_id']: r['count'] for r in result[0]['by_priority']}
    total = result[0]['totals'][0]['total'] if result[0]['totals'] else 0
    completed = by_status.get('Completed', 0)
    pending = total - completed
    rate = (completed / total * 100) if total else 0.0

    return jsonify({
        'totalTasks': total,
        'byStatus': by_status,
        'byPriority': by_priority,
        'completedCount': completed,
        'pendingCount': pending,
        'completionRate': round(rate, 2),
    })


# Endpoint 2: Productivity - tasks created in range, completed in range, daily trend
@app.route('/api/analytics/productivity', methods=['GET'])
def productivity():
    """Requires header: X-User-Id. Optional query: start_date, end_date (YYYY-MM-DD). Default: last 30 days."""
    user_id = validate_user_id()
    if user_id is None:
        return jsonify({'error': 'Valid X-User-Id header required'}), 401

    end = datetime.utcnow()
    start = end - timedelta(days=30)
    if request.args.get('start_date'):
        try:
            start = datetime.strptime(request.args['start_date'], '%Y-%m-%d')
        except ValueError:
            pass
    if request.args.get('end_date'):
        try:
            end = datetime.strptime(request.args['end_date'], '%Y-%m-%d') + timedelta(days=1)
        except ValueError:
            pass

    tasks_coll = get_tasks_collection()
    pipeline = [
        {'$match': {'userId': user_id}},
        {'$match': {'updatedAt': {'$gte': start, '$lt': end}}},
        {
            '$group': {
                '_id': {
                    'year': {'$year': '$updatedAt'},
                    'month': {'$month': '$updatedAt'},
                    'day': {'$dayOfMonth': '$updatedAt'},
                },
                'totalUpdated': {'$sum': 1},
                'completedCount': {'$sum': {'$cond': [{'$eq': ['$status', 'Completed']}, 1, 0]}},
            }
        },
        {'$sort': {'_id.year': 1, '_id.month': 1, '_id.day': 1}},
    ]
    daily = list(tasks_coll.aggregate(pipeline))

    created_in_period = tasks_coll.count_documents({
        'userId': user_id,
        'createdAt': {'$gte': start, '$lt': end},
    })
    completed_in_period = tasks_coll.count_documents({
        'userId': user_id,
        'status': 'Completed',
        'updatedAt': {'$gte': start, '$lt': end},
    })

    daily_trends = [
        {
            'date': f"{t['_id']['year']}-{t['_id']['month']:02d}-{t['_id']['day']:02d}",
            'totalUpdated': t['totalUpdated'],
            'completedCount': t['completedCount'],
        }
        for t in daily
    ]

    return jsonify({
        'startDate': start.strftime('%Y-%m-%d'),
        'endDate': (end - timedelta(days=1)).strftime('%Y-%m-%d'),
        'createdInPeriod': created_in_period,
        'completedInPeriod': completed_in_period,
        'dailyTrends': daily_trends,
    })


if __name__ == '__main__':
    port = int(os.getenv('FLASK_PORT', 5001))
    app.run(host='0.0.0.0', port=port, debug=os.getenv('FLASK_DEBUG', 'false').lower() == 'true')
