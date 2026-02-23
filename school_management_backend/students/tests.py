from rest_framework.test import APITestCase
from rest_framework import status

from accounts.models import User
from academics.models import Course, Lecturer, Subject
from students.models import Student


class BackendAssessmentTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(email="admin@example.com",
                                              password="admin12345")

        login = self.client.post("/api/login/",
                                  {"email": "admin@example.com",
                                   "password": "admin12345"},
                                  format="json")
        self.assertEqual(login.status_code, status.HTTP_200_OK)
        token = login.data["token"]
        self.client.credentials(HTTP_AUTHORIZATION=f"Token {token}")

        self.course_a = Course.objects.create(name="Course A",
                                                 description="A")
        self.course_b = Course.objects.create(name="Course B",
                                                 description="B")

        self.lecturer = Lecturer.objects.create(first_name="Lee",
                                                  last_name="Kim",
                                                  email="lee@example.com")

        self.sub_a = Subject.objects.create(name="Math A", description="",
                                            course=self.course_a,
                                            lecturer=self.lecturer)
        self.sub_b = Subject.objects.create(name="Math B", description="",
                                            course=self.course_b,
                                            lecturer=self.lecturer)

    def test_auth_required(self):
        self.client.credentials()
        res = self.client.get("/api/students/")
        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_create_student_success(self):
        payload = {
            "first_name": "John",
            "last_name": "Doe",
            "email": "john@example.com",
            "date_of_birth": "2005-01-01",
            "course": self.course_a.id,
            "subjects": [self.sub_a.id],
        }
        res = self.client.post("/api/students/", payload, format="json")
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)

    def test_business_rule_student_subject_must_match_course(self):
        payload = {
            "first_name": "Jane",
            "last_name": "Doe",
            "email": "jane@example.com",
            "date_of_birth": "2006-02-02",
            "course": self.course_a.id,
            "subjects": [self.sub_b.id],
        }
        res = self.client.post("/api/students/", payload, format="json")
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)

    def test_student_detail_includes_course_and_subjects(self):
        student = Student.objects.create(
            first_name="Lara",
            last_name="Moon",
            email="lara@example.com",
            date_of_birth="2004-04-04",
            course=self.course_a,
        )
        student.subjects.add(self.sub_a)

        res = self.client.get(f"/api/students/{student.id}/")
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertIn("course", res.data)
        self.assertIn("subjects", res.data)

    def test_course_detail_includes_students_and_subjects(self):
        student = Student.objects.create(
            first_name="Sam",
            last_name="Blue",
            email="sam@example.com",
            date_of_birth="2004-03-03",
            course=self.course_a,
        )
        student.subjects.add(self.sub_a)

        res = self.client.get(f"/api/courses/{self.course_a.id}/")
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertIn("students", res.data)
        self.assertIn("subjects", res.data)

    def test_lecturer_detail_includes_subjects_and_courses(self):
        res = self.client.get(f"/api/lecturers/{self.lecturer.id}/")
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertIn("subjects", res.data)
        self.assertIn("courses", res.data)
        self.assertTrue(isinstance(res.data["courses"], list))

    def test_course_delete_blocked_if_students_exist(self):
        student = Student.objects.create(
            first_name="Block",
            last_name="Delete",
            email="block@example.com",
            date_of_birth="2004-05-05",
            course=self.course_a,
        )
        res = self.client.delete(f"/api/courses/{self.course_a.id}/")
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)

    def test_subject_assign_students_enforces_same_course(self):
        # student in course A cannot be assigned to subject in course B
        student_a = Student.objects.create(
            first_name="A",
            last_name="Student",
            email="a_student@example.com",
            date_of_birth="2004-06-06",
            course=self.course_a,
        )

        payload = {
            "name": "Physics B",
            "description": "",
            "course": self.course_b.id,
            "lecturer": self.lecturer.id,
            "students": [student_a.id],
        }
        res = self.client.post("/api/subjects/", payload, format="json")
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)

    def test_list_students(self):
        Student.objects.create(
            first_name="List", last_name="Test",
            email="list@example.com", date_of_birth="2004-01-01",
            course=self.course_a,
        )
        res = self.client.get("/api/students/")
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(res.data), 1)

    def test_update_student(self):
        student = Student.objects.create(
            first_name="Old", last_name="Name",
            email="update@example.com", date_of_birth="2004-01-01",
            course=self.course_a,
        )
        res = self.client.put(f"/api/students/{student.id}/", {
            "first_name": "New", "last_name": "Name",
            "email": "update@example.com", "date_of_birth": "2004-01-01",
            "course": self.course_a.id, "subjects": [],
        }, format="json")
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data["first_name"], "New")

    def test_delete_student(self):
        student = Student.objects.create(
            first_name="Del", last_name="Me",
            email="delme@example.com", date_of_birth="2004-01-01",
            course=self.course_a,
        )
        res = self.client.delete(f"/api/students/{student.id}/")
        self.assertEqual(res.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Student.objects.filter(id=student.id).exists())

    def test_update_student_course_clears_invalid_subjects(self):
        """Changing course while having subjects from old course should fail."""
        student = Student.objects.create(
            first_name="Switch", last_name="Course",
            email="switch@example.com", date_of_birth="2004-01-01",
            course=self.course_a,
        )
        student.subjects.add(self.sub_a)
        res = self.client.put(f"/api/students/{student.id}/", {
            "first_name": "Switch", "last_name": "Course",
            "email": "switch@example.com", "date_of_birth": "2004-01-01",
            "course": self.course_b.id,
        }, format="json")
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)
