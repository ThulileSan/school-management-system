from rest_framework.test import APITestCase
from rest_framework import status

from accounts.models import User
from academics.models import Course, Lecturer, Subject
from students.models import Student


class ModelRelationshipTests(APITestCase):
    """Tests for model relationships and constraints."""

    def setUp(self):
        self.course = Course.objects.create(name="Computer Science",
                                            description="CS degree")
        self.lecturer = Lecturer.objects.create(first_name="Jane",
                                                last_name="Smith",
                                                email="jane@example.com")
        self.subject = Subject.objects.create(name="Algorithms",
                                              description="Algo 101",
                                              course=self.course,
                                              lecturer=self.lecturer)
        self.student = Student.objects.create(
            first_name="Tom",
            last_name="Brown",
            email="tom@example.com",
            date_of_birth="2003-05-15",
            course=self.course,
        )
        self.student.subjects.add(self.subject)

    def test_course_has_many_students(self):
        self.assertIn(self.student, self.course.students.all())

    def test_course_has_many_subjects(self):
        self.assertIn(self.subject, self.course.subjects.all())

    def test_subject_belongs_to_one_course(self):
        self.assertEqual(self.subject.course, self.course)

    def test_subject_has_one_lecturer(self):
        self.assertEqual(self.subject.lecturer, self.lecturer)

    def test_subject_has_many_students(self):
        self.assertIn(self.student, self.subject.students.all())

    def test_student_belongs_to_one_course(self):
        self.assertEqual(self.student.course, self.course)

    def test_student_can_enroll_in_multiple_subjects(self):
        sub2 = Subject.objects.create(name="Data Structures",
                                      description="DS 101",
                                      course=self.course,
                                      lecturer=self.lecturer)
        self.student.subjects.add(sub2)
        self.assertEqual(self.student.subjects.count(), 2)

    def test_lecturer_has_many_subjects(self):
        self.assertIn(self.subject, self.lecturer.subjects.all())

    def test_lecturer_linked_to_courses_through_subjects(self):
        courses = set(
            self.lecturer.subjects.values_list("course__id", flat=True)
        )
        self.assertIn(self.course.id, courses)

    def test_subject_unique_together_name_and_course(self):
        with self.assertRaises(Exception):
            Subject.objects.create(name="Algorithms",
                                   description="Duplicate",
                                   course=self.course,
                                   lecturer=self.lecturer)


class CourseCRUDTests(APITestCase):
    """Tests for Course CRUD endpoints."""

    def setUp(self):
        self.user = User.objects.create_user(email="admin@example.com",
                                             password="admin12345")
        login = self.client.post("/api/login/",
                                 {"email": "admin@example.com",
                                  "password": "admin12345"},
                                 format="json")
        self.client.credentials(
            HTTP_AUTHORIZATION=f"Token {login.data['token']}"
        )

    def test_create_course(self):
        res = self.client.post("/api/courses/",
                               {"name": "Engineering", "description": "Eng"},
                               format="json")
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        self.assertEqual(res.data["name"], "Engineering")

    def test_list_courses(self):
        Course.objects.create(name="Arts", description="Arts degree")
        res = self.client.get("/api/courses/")
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(res.data), 1)

    def test_retrieve_course(self):
        course = Course.objects.create(name="Science", description="Sci")
        res = self.client.get(f"/api/courses/{course.id}/")
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data["name"], "Science")
        self.assertIn("students", res.data)
        self.assertIn("subjects", res.data)

    def test_update_course(self):
        course = Course.objects.create(name="Old Name", description="Old")
        res = self.client.put(f"/api/courses/{course.id}/",
                              {"name": "New Name", "description": "New"},
                              format="json")
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data["name"], "New Name")

    def test_partial_update_course(self):
        course = Course.objects.create(name="Partial", description="Test")
        res = self.client.patch(f"/api/courses/{course.id}/",
                                {"description": "Updated"},
                                format="json")
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data["description"], "Updated")

    def test_delete_course_success(self):
        course = Course.objects.create(name="ToDelete", description="Del")
        res = self.client.delete(f"/api/courses/{course.id}/")
        self.assertEqual(res.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Course.objects.filter(id=course.id).exists())

    def test_delete_course_cascades_subjects(self):
        course = Course.objects.create(name="Cascade", description="Test")
        lecturer = Lecturer.objects.create(first_name="L", last_name="C",
                                           email="lc@example.com")
        Subject.objects.create(name="Sub", description="",
                               course=course, lecturer=lecturer)
        self.client.delete(f"/api/courses/{course.id}/")
        self.assertEqual(
            Subject.objects.filter(course=course).count(), 0
        )


class LecturerCRUDTests(APITestCase):
    """Tests for Lecturer CRUD endpoints."""

    def setUp(self):
        self.user = User.objects.create_user(email="admin@example.com",
                                             password="admin12345")
        login = self.client.post("/api/login/",
                                 {"email": "admin@example.com",
                                  "password": "admin12345"},
                                 format="json")
        self.client.credentials(
            HTTP_AUTHORIZATION=f"Token {login.data['token']}"
        )

    def test_create_lecturer(self):
        res = self.client.post("/api/lecturers/",
                               {"first_name": "Alice", "last_name": "Wonder",
                                "email": "alice@example.com"},
                               format="json")
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        self.assertEqual(res.data["first_name"], "Alice")

    def test_list_lecturers(self):
        Lecturer.objects.create(first_name="Bob", last_name="Ross",
                                email="bob@example.com")
        res = self.client.get("/api/lecturers/")
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(res.data), 1)

    def test_retrieve_lecturer(self):
        lecturer = Lecturer.objects.create(first_name="Eve", last_name="Day",
                                           email="eve@example.com")
        res = self.client.get(f"/api/lecturers/{lecturer.id}/")
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertIn("subjects", res.data)
        self.assertIn("courses", res.data)

    def test_update_lecturer(self):
        lecturer = Lecturer.objects.create(first_name="Old", last_name="Name",
                                           email="old@example.com")
        res = self.client.put(f"/api/lecturers/{lecturer.id}/",
                              {"first_name": "New", "last_name": "Name",
                               "email": "old@example.com"},
                              format="json")
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data["first_name"], "New")

    def test_delete_lecturer_success(self):
        lecturer = Lecturer.objects.create(first_name="Del", last_name="Me",
                                           email="del@example.com")
        res = self.client.delete(f"/api/lecturers/{lecturer.id}/")
        self.assertEqual(res.status_code, status.HTTP_204_NO_CONTENT)

    def test_delete_lecturer_blocked_if_subjects_exist(self):
        lecturer = Lecturer.objects.create(first_name="Busy", last_name="Lec",
                                           email="busy@example.com")
        course = Course.objects.create(name="BlockCourse", description="")
        Subject.objects.create(name="BlockSub", description="",
                               course=course, lecturer=lecturer)
        res = self.client.delete(f"/api/lecturers/{lecturer.id}/")
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)


class SubjectCRUDTests(APITestCase):
    """Tests for Subject CRUD endpoints."""

    def setUp(self):
        self.user = User.objects.create_user(email="admin@example.com",
                                             password="admin12345")
        login = self.client.post("/api/login/",
                                 {"email": "admin@example.com",
                                  "password": "admin12345"},
                                 format="json")
        self.client.credentials(
            HTTP_AUTHORIZATION=f"Token {login.data['token']}"
        )
        self.course = Course.objects.create(name="IT", description="IT")
        self.lecturer = Lecturer.objects.create(first_name="Prof",
                                                last_name="X",
                                                email="profx@example.com")

    def test_create_subject(self):
        res = self.client.post("/api/subjects/",
                               {"name": "Networking", "description": "Net",
                                "course": self.course.id,
                                "lecturer": self.lecturer.id},
                               format="json")
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)

    def test_list_subjects(self):
        Subject.objects.create(name="DB", description="",
                               course=self.course, lecturer=self.lecturer)
        res = self.client.get("/api/subjects/")
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(res.data), 1)

    def test_retrieve_subject(self):
        sub = Subject.objects.create(name="OS", description="",
                                     course=self.course,
                                     lecturer=self.lecturer)
        res = self.client.get(f"/api/subjects/{sub.id}/")
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertIn("course", res.data)
        self.assertIn("lecturer", res.data)
        self.assertIn("students", res.data)

    def test_update_subject(self):
        sub = Subject.objects.create(name="OldSub", description="",
                                     course=self.course,
                                     lecturer=self.lecturer)
        res = self.client.put(f"/api/subjects/{sub.id}/",
                              {"name": "NewSub", "description": "Updated",
                               "course": self.course.id,
                               "lecturer": self.lecturer.id},
                              format="json")
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data["name"], "NewSub")

    def test_delete_subject(self):
        sub = Subject.objects.create(name="DelSub", description="",
                                     course=self.course,
                                     lecturer=self.lecturer)
        res = self.client.delete(f"/api/subjects/{sub.id}/")
        self.assertEqual(res.status_code, status.HTTP_204_NO_CONTENT)

    def test_create_subject_without_course_fails(self):
        res = self.client.post("/api/subjects/",
                               {"name": "NoCourse", "description": "",
                                "lecturer": self.lecturer.id},
                               format="json")
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)

    def test_create_subject_without_lecturer_fails(self):
        res = self.client.post("/api/subjects/",
                               {"name": "NoLec", "description": "",
                                "course": self.course.id},
                               format="json")
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)
