# Team-Task-Manager

Team-Task-Manager is a modern, premium web application for team task management. Designed with a futuristic, glassmorphism-inspired dark UI.

## Features
- **Role-Based Access Control**: Admin and Member roles.
- **Project Management**: Create projects, assign members.
- **Task Management**: Kanban-style task tracking.
- **Dashboard**: Real-time stats on pending, completed, and overdue tasks.
- **Premium UI**: Framer motion animations, glassmorphism design, responsive layout.

## Tech Stack
- **Frontend**: React, Vite, React Router, Zustand, Tailwind CSS, Framer Motion, Lucide React
- **Backend**: Node.js, Express, MongoDB (Mongoose), JWT Auth

## Setup Instructions

### Prerequisites
- Node.js installed
- MongoDB Atlas connection string (or local MongoDB)

### Environment Variables
1. Create `.env` in the `backend` folder:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

### Running Locally

1. **Backend**
```bash
cd backend
npm install
npm run start # or node server.js
```

2. **Frontend**
```bash
cd frontend
npm install
npm run dev
```

## API Endpoints

### Auth
- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/login` - Login

### Projects
- `GET /api/projects` - Get all projects for logged-in user
- `POST /api/projects` - Create project (Admin only)
- `GET /api/projects/:id` - Get specific project
- `PUT /api/projects/:id` - Update project (Admin only)

### Tasks
- `GET /api/tasks` - Get assigned tasks (all tasks for Admin)
- `POST /api/tasks` - Create task (Admin only)
- `PUT /api/tasks/:id` - Update task status

### Users
- `GET /api/users` - Get all users (Admin only)

## Deployment (Railway)
1. Push this repository to GitHub.
2. Go to [Railway.app](https://railway.app/).
3. Create a New Project -> Deploy from GitHub repo.
4. Railway will auto-detect the `railway.toml` or auto-detect `frontend` and `backend` folders if using monorepo setup.
5. Add the `MONGO_URI` and `JWT_SECRET` variables in Railway project settings.
