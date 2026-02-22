from rest_framework import viewsets
from .models import Student
from .serializers import StudentSerializer, StudentDetailSerializer


class StudentViewSet(viewsets.ModelViewSet):
    queryset = Student.objects.select_related("course"). \
        prefetch_related("subjects").all()

    def get_serializer_class(self):
        if self.action == "retrieve":
            return StudentDetailSerializer
        return StudentSerializer
