import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { StudentsService } from '../../../../core/services/students.service';
import { CoursesService } from '../../../../core/services/courses.service';
import { SubjectsService } from '../../../../core/services/subjects.service';
import { Student, StudentDetail } from '../../../../models/student.model';
import { Course } from '../../../../models/course.model';
import { Subject } from '../../../../models/subject.model';

@Component({
  selector: 'app-student-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './student-form.component.html',
  styleUrl: './student-form.component.scss'
})
export class StudentFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private studentsService = inject(StudentsService);
  private coursesService = inject(CoursesService);
  private subjectsService = inject(SubjectsService);

  studentForm: FormGroup = this.fb.group({
    first_name: ['', Validators.required],
    last_name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    date_of_birth: ['', Validators.required],
    course: ['', Validators.required]
  });

  isEdit = false;
  studentId: number | null = null;
  loading = false;
  courses: Course[] = [];
  allSubjects: Subject[] = [];
  filteredSubjects: Subject[] = [];
  selectedSubjects: number[] = [];

  ngOnInit(): void {
    this.loadCourses();
    this.loadSubjects();

    const id = this.route.snapshot.paramMap.get('id');
    if (id && id !== 'new') {
      this.isEdit = true;
      this.studentId = +id;
      this.loadStudent(+id);
    }
  }

  loadCourses(): void {
    this.coursesService.getCourses().subscribe({
      next: (courses) => this.courses = courses,
      error: (err) => console.error('Failed to load courses:', err)
    });
  }

  loadSubjects(): void {
    this.subjectsService.getSubjects().subscribe({
      next: (subjects) => {
        this.allSubjects = subjects;
        this.filterSubjects();
      },
      error: (err) => console.error('Failed to load subjects:', err)
    });
  }

  loadStudent(id: number): void {
    this.studentsService.getStudent(id).subscribe({
      next: (student: StudentDetail) => {
        this.studentForm.patchValue({
          first_name: student.first_name,
          last_name: student.last_name,
          email: student.email,
          date_of_birth: student.date_of_birth,
          course: student.course.id
        });
        this.selectedSubjects = student.subjects.map(s => s.id);
        this.filterSubjects();
      },
      error: (err) => console.error('Failed to load student:', err)
    });
  }

  onCourseChange(): void {
    this.filterSubjects();
    // Clear subjects that don't belong to the new course
    const courseId = +this.studentForm.get('course')?.value;
    this.selectedSubjects = this.selectedSubjects.filter(id =>
      this.allSubjects.find(s => s.id === id && s.course === courseId)
    );
  }

  filterSubjects(): void {
    const courseId = +this.studentForm.get('course')?.value;
    if (courseId) {
      this.filteredSubjects = this.allSubjects.filter(s => s.course === courseId);
    } else {
      this.filteredSubjects = [];
    }
  }

  isSubjectSelected(subjectId: number): boolean {
    return this.selectedSubjects.includes(subjectId);
  }

  toggleSubject(subjectId: number): void {
    const index = this.selectedSubjects.indexOf(subjectId);
    if (index > -1) {
      this.selectedSubjects.splice(index, 1);
    } else {
      this.selectedSubjects.push(subjectId);
    }
  }

  onSubmit(): void {
    if (this.studentForm.invalid) return;

    this.loading = true;
    const studentData: Partial<Student> = {
      ...this.studentForm.value,
      course: +this.studentForm.value.course,
      subjects: this.selectedSubjects
    };

    const request = this.isEdit && this.studentId
      ? this.studentsService.updateStudent(this.studentId, studentData)
      : this.studentsService.createStudent(studentData);

    request.subscribe({
      next: () => {
        void this.router.navigate(['/dashboard/students']);
      },
      error: (err) => {
        this.loading = false;
        console.error('Failed to save student:', err);
        alert(err.error?.detail || 'Failed to save student. Please try again.');
      }
    });
  }

  goBack(): void {
    void this.router.navigate(['/dashboard/students']);
  }
}
