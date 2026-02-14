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

## Deploy Frontend on Vercel

You can deploy **only the frontend** on Vercel. The backend and analytics must be hosted elsewhere (e.g. [Render](https://render.com), [Railway](https://railway.app)) and use **MongoDB Atlas** for the database.

### Steps

1. **Push your code to GitHub** (you already have: [quicktask-mern-python](https://github.com/munagalamose/quicktask-mern-python)).

2. **Go to [vercel.com](https://vercel.com)** and sign in with GitHub.

3. **Import your repo**
   - Click **Add New…** → **Project**.
   - Select **munagalamose/quicktask-mern-python**.
   - Click **Import**.

4. **Configure the project**
   - **Root Directory:** Click **Edit**, choose **frontend**, then **Continue**.
   - **Framework Preset:** Vite (should be auto-detected).
   - **Build Command:** `npm run build` (default).
   - **Output Directory:** `dist` (default).
   - **Install Command:** `npm install` (default).

5. **Add Environment Variables** (required for API and analytics)
   - **Name:** `VITE_API_URL`  
     **Value:** Your backend API URL, e.g. `https://your-backend.onrender.com/api`
   - **Name:** `VITE_ANALYTICS_URL`  
     **Value:** Your analytics URL, e.g. `https://your-analytics.onrender.com`  
   - If you don’t have backend/analytics deployed yet, you can add placeholder URLs and update them later.

6. Click **Deploy**. Vercel will build and deploy the frontend and give you a URL like `https://quicktask-xxx.vercel.app`.

### After deploy

- **Backend:** Deploy the `backend/` folder on Render (Web Service) or Railway, set `MONGODB_URI` (e.g. MongoDB Atlas) and `JWT_SECRET`, then set your frontend’s `VITE_API_URL` to that backend URL and redeploy the frontend on Vercel.
- **Analytics:** Deploy the `analytics-service/` (Python/Flask) on Render or Railway with the same `MONGODB_URI`, then set `VITE_ANALYTICS_URL` and redeploy the frontend.

React Router is configured via `frontend/vercel.json` so routes like `/dashboard` and `/tasks` work correctly.

## License

MIT
