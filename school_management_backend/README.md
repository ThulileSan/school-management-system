# School Management System — Backend (Django + DRF + PostgreSQL)

## Tech Stack
- Django, Django REST Framework
- PostgreSQL
- DRF Token Authentication

## Setup
1. Create and activate virtualenv
2. Install dependencies:
   ```
   pip install -r requirements.txt
   ```
3. Configure environment variables (see `.env.example`)
4. Create PostgreSQL database:
   - Create DB named `school_management` (or set `DB_NAME`)
5. Run migrations:
   ```
   python manage.py makemigrations
   python manage.py migrate
   ```
6. Create admin user (no registration endpoint per assessment):
   ```
   python manage.py createsuperuser
   ```
7. Run server:
   ```
   python manage.py runserver
   ```

## Authentication
POST /api/login/
Body:
```json
{
  "email": "admin@example.com",
  "password": "..."
}
```
Response:
```json
{ "token": "..." }
```

Use the token for all other endpoints:
```
Authorization: Token <token>
```

## API Endpoints (CRUD via ViewSets)
- Students: /api/students/
  - GET list
  - GET /api/students/{id}/ includes course details + subjects enrolled
- Courses: /api/courses/
  - GET /api/courses/{id}/ includes students registered + subjects offered
- Subjects: /api/subjects/
- Lecturers: /api/lecturers/
  - GET /api/lecturers/{id}/ includes subjects taught + courses indirectly linked

## Business Rules
- Students cannot enroll in subjects outside their course (validated on Student and Subject writes).
- Subject must have a course and lecturer (FK enforced + serializer validation).
- Course deletion policy:
  - Course deletion is blocked when students exist (PROTECT) to preserve referential integrity.
  - Course deletion cascades subjects (CASCADE) because subjects are scoped to a course.

## Tests
Run:
```
python manage.py test
```
