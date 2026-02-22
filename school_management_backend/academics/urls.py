from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CourseViewSet, SubjectViewSet, LecturerViewSet

router = DefaultRouter()
router.register(r"courses", CourseViewSet, basename="courses")
router.register(r"subjects", SubjectViewSet, basename="subjects")
router.register(r"lecturers", LecturerViewSet, basename="lecturers")

urlpatterns = [
    path("", include(router.urls)),
]
