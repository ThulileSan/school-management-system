from django.db.models.deletion import ProtectedError
from rest_framework import status, viewsets
from rest_framework.response import Response

from .models import Course, Lecturer, Subject
from .serializers import (
    CourseSerializer,
    CourseDetailSerializer,
    LecturerSerializer,
    LecturerDetailSerializer,
    SubjectSerializer,
    SubjectDetailSerializer,
)


class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.all()

    def get_serializer_class(self):
        if self.action == "retrieve":
            return CourseDetailSerializer
        return CourseSerializer

    def destroy(self, request, *args, **kwargs):
        try:
            return super().destroy(request, *args, **kwargs)
        except ProtectedError:
            return Response(
                {"detail": "Cannot delete course while students exist. "
                           "Remove/reassign students first."},
                status=status.HTTP_400_BAD_REQUEST,
            )


class LecturerViewSet(viewsets.ModelViewSet):
    queryset = Lecturer.objects.all()

    def get_serializer_class(self):
        if self.action == "retrieve":
            return LecturerDetailSerializer
        return LecturerSerializer

    def destroy(self, request, *args, **kwargs):
        try:
            return super().destroy(request, *args, **kwargs)
        except ProtectedError:
            return Response(
                {"detail": "Cannot delete lecturer while subjects exist. "
                           "Reassign subjects first."},
                status=status.HTTP_400_BAD_REQUEST,
            )


class SubjectViewSet(viewsets.ModelViewSet):
    queryset = Subject.objects.select_related("course", "lecturer"). \
        prefetch_related("students").all()

    def get_serializer_class(self):
        if self.action == "retrieve":
            return SubjectDetailSerializer
        return SubjectSerializer
