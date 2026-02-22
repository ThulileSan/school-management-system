from django.db import models
from academics.models import Course, Subject


class Student(models.Model):
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    date_of_birth = models.DateField()
    course = models.ForeignKey(Course, on_delete=models.PROTECT,
                              related_name="students")
    subjects = models.ManyToManyField(Subject, blank=True,
                                      related_name="students")

    def __str__(self):
        return f"{self.first_name} {self.last_name}"
