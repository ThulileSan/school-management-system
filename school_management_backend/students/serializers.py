from rest_framework import serializers
from academics.models import Subject, Course
from academics.serializers import CourseSerializer, SubjectDetailSerializer
from .models import Student


class StudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = ["id", "first_name", "last_name", "email",
                  "date_of_birth", "course", "subjects"]

    def validate(self, data):
        instance = getattr(self, "instance", None)

        new_course = data.get("course") or (instance.course if instance else None)

        # If subjects explicitly provided, validate them against new_course
        if "subjects" in data:
            subjects = data.get("subjects") or []
            invalid = [s.id for s in subjects if s.course_id != new_course.id]
            if invalid:
                raise serializers.ValidationError(
                    "Student cannot enroll in subjects outside their course."
                )
        else:
            # If course is being changed but subjects are not being provided,
            # validate existing subjects remain within the new course.
            if instance and "course" in data:
                existing_subjects = instance.subjects.all()
                invalid_existing = [s.id for s in existing_subjects
                                    if s.course_id != new_course.id]
                if invalid_existing:
                    raise serializers.ValidationError(
                        "Cannot change course while enrolled subjects are "
                        "outside the new course. Clear/replace subjects."
                    )

        return data


class StudentDetailSerializer(serializers.ModelSerializer):
    course = CourseSerializer(read_only=True)
    subjects = SubjectDetailSerializer(many=True, read_only=True)

    class Meta:
        model = Student
        fields = ["id", "first_name", "last_name", "email",
                  "date_of_birth", "course", "subjects"]
