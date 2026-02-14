# QuickTask - MERN + Python

A full-stack personal task management application with **React** (frontend), **Node.js + Express** (backend), **MongoDB**, and a **Python Flask** analytics service.

## Features

- **User authentication** – Register, login, JWT-protected routes
- **Task management** – Create, read, update, delete tasks with title, description, priority, status, due date
- **Filter & sort** – By status, priority, search by title, sort by date/priority
- **Dashboard** – Total/completed/pending tasks, completion rate, priority chart, productivity summary
- **Analytics service** – Python microservice for user stats and productivity trends

## Tech Stack

| Layer     | Technology                    |
|----------|-------------------------------|
| Frontend | React, Vite, Tailwind CSS, Axios, React Router |
| Backend   | Node.js, Express.js           |
| Database | MongoDB                       |
| Auth     | JWT (JSON Web Tokens)         |
| Analytics| Python, Flask                 |

## Project Structure

```
quicktask/
├── backend/           # Express API (port 5000)
├── frontend/          # React app (port 3000)
├── analytics-service/ # Python Flask (port 5001)
└── README.md
```

## Prerequisites

- **Node.js** 18+
- **Python** 3.9+
- **MongoDB** (local or connection string)

## Setup & Run

### 1. Clone the repo

```bash
git clone https://github.com/munagalamose/quicktask-mern-python.git
cd quicktask-mern-python
```

### 2. Backend

```bash
cd backend
npm install
cp .env.example .env
# Edit .env: MONGODB_URI, JWT_SECRET
npm run dev
```

Runs at **http://localhost:5000**

### 3. Analytics (Python)

```bash
cd analytics-service
python -m venv venv
# Windows:
venv\Scripts\activate
# macOS/Linux:
# source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
# Edit .env: MONGODB_URI (same as backend)
python app.py
```

Runs at **http://localhost:5001**

### 4. Frontend

```bash
cd frontend
npm install
cp .env.example .env
# .env: VITE_API_URL=http://localhost:5000/api, VITE_ANALYTICS_URL=http://localhost:5001
npm run dev
```

Open **http://localhost:3000**

### Seed data (optional)

```bash
cd backend
npm run seed
```

Creates user **demo@quicktask.com** / **demo123** with 5 sample tasks.

## Environment Variables

**backend/.env**

- `PORT` – API port (default 5000)
- `MONGODB_URI` – MongoDB connection string
- `JWT_SECRET` – Secret for JWT signing

**frontend/.env**

- `VITE_API_URL` – Backend API base URL (e.g. http://localhost:5000/api)
- `VITE_ANALYTICS_URL` – Analytics service URL (e.g. http://localhost:5001)

**analytics-service/.env**

- `FLASK_PORT` – Analytics port (default 5001)
- `MONGODB_URI` – Same MongoDB as backend

## API Overview

### Backend (Express)

- `POST /api/auth/register` – Register (email, password, name?)
- `POST /api/auth/login` – Login (email, password)
- `GET /api/auth/me` – Current user (Bearer token)
- `GET /api/tasks` – List tasks (query: status, priority, search, sort, order)
- `POST /api/tasks` – Create task
- `GET /api/tasks/:id` – Get task
- `PUT /api/tasks/:id` – Update task
- `PATCH /api/tasks/:id/status` – Update status
- `DELETE /api/tasks/:id` – Delete task

### Analytics (Flask)

- `GET /api/analytics/user-stats` – Header `X-User-Id` (user’s MongoDB ObjectId). Returns total tasks, by status, by priority, completion rate.
- `GET /api/analytics/productivity` – Header `X-User-Id`. Optional query: `start_date`, `end_date` (YYYY-MM-DD). Returns created/completed in period and daily trends.

## License

MIT
