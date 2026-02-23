# School Management System

A full-stack School Management Web Application built with Django, Django REST Framework, Angular, and PostgreSQL.

## Tech Stack

- **Backend:** Django 6.0, Django REST Framework 3.16
- **Frontend:** Angular 19 (standalone components, zoneless change detection)
- **Database:** PostgreSQL
- **Authentication:** DRF Token Authentication

## Project Structure

```
school-management-system/
├── school_management_backend/    # Django REST API
│   ├── accounts/                 # Custom User model, login endpoint
│   ├── academics/                # Course, Lecturer, Subject models + API
│   ├── students/                 # Student model + API
│   └── config/                   # Django settings, URLs
├── school_management_frontend/   # Angular SPA
│   └── src/app/
│       ├── core/                 # Guards, interceptors, services
│       ├── features/             # Auth, dashboard, students, courses, lecturers, subjects
│       ├── models/               # TypeScript interfaces
│       └── shared/               # Reusable components (spinner, snackbar, no-data)
└── README.md
```

## Setup Instructions

### Prerequisites

- Python 3.12+
- Node.js 20+
- PostgreSQL 15+

### Backend Setup

```bash
cd school_management_backend
python -m venv venv
venv\Scripts\activate          # Windows
# source venv/bin/activate     # macOS/Linux
pip install -r requirements.txt
```

Create a `.env` file (see `.env.example`):

```
SECRET_KEY=your-secret-key
DEBUG=True
ALLOWED_HOSTS=127.0.0.1,localhost
DB_NAME=school_management
DB_USER=postgres
DB_PASSWORD=postgres
DB_HOST=localhost
DB_PORT=5432
```

Create the PostgreSQL database, then run:

```bash
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

### Frontend Setup

```bash
cd school_management_frontend
npm install
ng serve
```

Navigate to `http://localhost:4200`

## Environment Variables

| Variable | Description | Default |
|---|---|---|
| `SECRET_KEY` | Django secret key | `change-me` |
| `DEBUG` | Debug mode | `True` |
| `ALLOWED_HOSTS` | Comma-separated hosts | `127.0.0.1,localhost` |
| `DB_NAME` | PostgreSQL database name | `school_management` |
| `DB_USER` | PostgreSQL user | `postgres` |
| `DB_PASSWORD` | PostgreSQL password | `postgres` |
| `DB_HOST` | Database host | `localhost` |
| `DB_PORT` | Database port | `5432` |

## API Documentation

Interactive Swagger UI available at: `/api/docs/`

### Authentication

**Login:** `POST /api/login/`

Returns: `{ "token": "<token>" }`

All protected endpoints require header: `Authorization: Token <token>`

### Endpoints

| Resource | List | Detail | Create | Update | Delete |
|---|---|---|---|---|---|
| Students | `GET /api/students/` | `GET /api/students/{id}/` | `POST /api/students/` | `PUT /api/students/{id}/` | `DELETE /api/students/{id}/` |
| Courses | `GET /api/courses/` | `GET /api/courses/{id}/` | `POST /api/courses/` | `PUT /api/courses/{id}/` | `DELETE /api/courses/{id}/` |
| Subjects | `GET /api/subjects/` | `GET /api/subjects/{id}/` | `POST /api/subjects/` | `PUT /api/subjects/{id}/` | `DELETE /api/subjects/{id}/` |
| Lecturers | `GET /api/lecturers/` | `GET /api/lecturers/{id}/` | `POST /api/lecturers/` | `PUT /api/lecturers/{id}/` | `DELETE /api/lecturers/{id}/` |

### Detail Endpoint Responses

- **Student detail** includes: course details, subjects enrolled
- **Course detail** includes: students registered, subjects offered
- **Lecturer detail** includes: subjects taught, courses (derived from subjects)
- **Subject detail** includes: course, lecturer, students enrolled

## Database Design

### Relationships

- **Course** has many Students, has many Subjects
- **Student** belongs to one Course, can enroll in multiple Subjects (within their course)
- **Subject** belongs to one Course, has one Lecturer, has many Students
- **Lecturer** has many Subjects, indirectly linked to Courses through Subjects

### Business Rules

- Student cannot enroll in subjects outside their course
- Subject must belong to a course and have a lecturer
- Course deletion is **blocked** if students exist (`PROTECT`)
- Course deletion **cascades** subjects (`CASCADE`)
- Lecturer deletion is **blocked** if subjects exist (`PROTECT`)

## Testing

```bash
cd school_management_backend
python manage.py test
```

Tests cover:
- Model relationships (9 tests)
- Authentication (5 tests)
- Full CRUD for all entities (Courses, Lecturers, Subjects, Students)
- Business rules validation (subject-course matching, delete protection)

## Admin Test Credentials

```
Email: thulile.d.sibiya@gmail.com
Password: Dlmfun01
```

## Deployed Application

**Live Application:** https://school-management-frontend-ccvr.onrender.com

**Backend API:** https://school-management-api-backend.onrender.com/api/

**API Documentation:** https://school-management-api-backend.onrender.com/api/docs/

**Django Admin:** https://school-management-api-backend.onrender.com/admin/

### Hosting Note

⚠️ **Important:** This application is hosted on Render's free tier. The first request after 15 minutes of inactivity may take 30-60 seconds as the server spins up from sleep mode. Subsequent requests will be instant. This is normal behavior for free-tier hosting.
