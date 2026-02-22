from django.db import models


class Course(models.Model):
    name = models.CharField(max_length=255, unique=True)
    description = models.TextField(blank=True)

    def __str__(self):
        return self.name


class Lecturer(models.Model):
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)

    def __str__(self):
        return f"{self.first_name} {self.last_name}"


class Subject(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    course = models.ForeignKey(Course, on_delete=models.CASCADE,
                               related_name="subjects")
    lecturer = models.ForeignKey(Lecturer, on_delete=models.PROTECT,
                                 related_name="subjects")

    class Meta:
        unique_together = ("name", "course")

    def __str__(self):
        return f"{self.name} ({self.course.name})"
