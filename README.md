# HRMS Lite

A lightweight Human Resource Management System for managing employee records and tracking daily attendance.

## Tech Stack

| Layer    | Technology                    |
| -------- | ----------------------------- |
| Frontend | React 18, Vite, Tailwind CSS  |
| Backend  | Python, FastAPI, SQLAlchemy   |
| Database | MySQL 8.0                     |
| Deploy   | Docker, Docker Compose, Nginx |

## Features

- **Employee Management** — Add, view, and delete employee records
- **Attendance Tracking** — Mark daily attendance (Present / Absent) per employee
- **Dashboard** — Summary cards showing total employees, present today, absent today
- **Date Filtering** — Filter attendance records by date range (bonus)
- **Present Day Count** — Per-employee present / absent day counts (bonus)
- **Validation** — Server-side and client-side validation with meaningful error messages
- **Responsive UI** — Works on desktop and mobile

## Project Structure

```
Hrms/
├── frontend/               # React + Vite + Tailwind
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   └── services/       # API service layer (axios)
│   ├── Dockerfile          # Multi-stage build → Nginx
│   └── nginx.conf          # SPA routing + API proxy
├── backend/                # FastAPI + SQLAlchemy
│   ├── app/
│   │   ├── main.py         # App entry, CORS, router registration
│   │   ├── database.py     # DB engine and session
│   │   ├── models.py       # ORM models (Employee, Attendance)
│   │   ├── schemas.py      # Pydantic request/response schemas
│   │   └── routers/        # API route handlers
│   ├── Dockerfile
│   └── requirements.txt
├── docker-compose.yml      # MySQL + Backend + Frontend services
└── README.md
```

## Getting Started

### Prerequisites

- Docker & Docker Compose **OR**
- Node.js 18+ and Python 3.11+ (for local development)

### Run with Docker (recommended)

```bash
# Clone the repo
git clone https://github.com/TheLameOne/Hrms.git
cd Hrms

# Start all services
docker-compose up --build

# Access the app
# Frontend: http://localhost:3000
# Backend API: http://localhost:8000/api/health
# API Docs: http://localhost:8000/docs
```

### Run Locally (without Docker)

#### Backend

```bash
cd backend

# Create virtual environment
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # macOS/Linux

# Install dependencies
pip install -r requirements.txt

# Set environment variable
# Create a .env file with:
# DATABASE_URL=mysql+pymysql://hrms_user:hrms_pass@localhost:3306/hrms_db

# Run the server
uvicorn app.main:app --reload --port 8000
```

#### Frontend

```bash
cd frontend

# Install dependencies
npm install

# Start dev server (proxies /api to localhost:8000)
npm run dev
```

Open http://localhost:3000 in your browser.

## API Endpoints

| Method | Endpoint                        | Description                                   |
| ------ | ------------------------------- | --------------------------------------------- |
| GET    | `/api/health`                   | Health check                                  |
| POST   | `/api/employees/`               | Create a new employee                         |
| GET    | `/api/employees/`               | List all employees                            |
| GET    | `/api/employees/{id}`           | Get a single employee                         |
| DELETE | `/api/employees/{id}`           | Delete an employee                            |
| POST   | `/api/attendance/`              | Mark attendance for an employee               |
| GET    | `/api/attendance/{employee_id}` | Get attendance records (optional date filter) |
| GET    | `/api/dashboard/summary`        | Dashboard summary (counts)                    |

## Environment Variables

| Variable       | Default                                                      | Description             |
| -------------- | ------------------------------------------------------------ | ----------------------- |
| `DATABASE_URL` | `mysql+pymysql://hrms_user:hrms_pass@localhost:3306/hrms_db` | MySQL connection URL    |
| `VITE_API_URL` | `/api`                                                       | API base URL (frontend) |

## Assumptions & Limitations

- **Single admin user** — no authentication or authorization required
- **No leave management or payroll** — intentionally out of scope
- **Auto-create tables** — SQLAlchemy creates tables on startup (no migration tool)
- **Cascade delete** — deleting an employee removes all their attendance records
- **MySQL 8.0** — runs via Docker; for local dev you need a MySQL instance running
