from rest_framework import serializers
from .models import Course, Lecturer, Subject
from students.models import Student


class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = ["id", "name", "description"]


class LecturerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lecturer
        fields = ["id", "first_name", "last_name", "email"]


class StudentSummarySerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = ["id", "first_name", "last_name", "email"]


class SubjectSerializer(serializers.ModelSerializer):
    # Allow assigning students from Subject endpoints
    students = serializers.PrimaryKeyRelatedField(
        many=True, queryset=Student.objects.all(), required=False
    )

    class Meta:
        model = Subject
        fields = ["id", "name", "description", "course", "lecturer", "students"]

    def validate(self, data):
        course = data.get("course") or getattr(self.instance, "course", None)
        lecturer = data.get("lecturer") or getattr(self.instance, "lecturer", None)
        if not course:
            raise serializers.ValidationError("Subject must belong to a course.")
        if not lecturer:
            raise serializers.ValidationError("Subject must have a lecturer.")

        students = data.get("students")
        if students is None:
            if self.instance and "course" in data:
                existing_students = self.instance.students.all()
                invalid = [s.id for s in existing_students
                          if s.course_id != course.id]
                if invalid:
                    raise serializers.ValidationError(
                        "Cannot change subject course while enrolled "
                        "students are in a different course."
                    )
            return data

        invalid_students = [s.id for s in students if s.course_id != course.id]
        if invalid_students:
            raise serializers.ValidationError(
                "Cannot assign students from a different course to this subject."
            )
        return data

    def create(self, validated_data):
        students = validated_data.pop("students", [])
        subject = super().create(validated_data)
        if students:
            subject.students.set(students)
        return subject

    def update(self, instance, validated_data):
        students = validated_data.pop("students", None)
        subject = super().update(instance, validated_data)
        if students is not None:
            subject.students.set(students)
        return subject


class SubjectDetailSerializer(serializers.ModelSerializer):
    course = CourseSerializer(read_only=True)
    lecturer = LecturerSerializer(read_only=True)
    students = StudentSummarySerializer(many=True, read_only=True)

    class Meta:
        model = Subject
        fields = ["id", "name", "description", "course", "lecturer", "students"]


class CourseDetailSerializer(serializers.ModelSerializer):
    students = StudentSummarySerializer(many=True, read_only=True)
    subjects = SubjectDetailSerializer(many=True, read_only=True)

    class Meta:
        model = Course
        fields = ["id", "name", "description", "students", "subjects"]


class LecturerDetailSerializer(serializers.ModelSerializer):
    subjects = SubjectDetailSerializer(many=True, read_only=True)
    courses = serializers.SerializerMethodField()

    class Meta:
        model = Lecturer
        fields = ["id", "first_name", "last_name", "email", "subjects", "courses"]

    def get_courses(self, obj):
        courses = {}
        for s in obj.subjects.select_related("course").all():
            courses[s.course.id] = {"id": s.course.id, "name": s.course.name}
        return list(courses.values())
