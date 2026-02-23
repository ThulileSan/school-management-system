import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SubjectsService } from '../../../../core/services/subjects.service';
import { CoursesService } from '../../../../core/services/courses.service';
import { LecturersService } from '../../../../core/services/lecturers.service';
import { StudentsService } from '../../../../core/services/students.service';
import { Subject, SubjectDetail } from '../../../../models/subject.model';
import { Course } from '../../../../models/course.model';
import { Lecturer } from '../../../../models/lecturer.model';
import { Student } from '../../../../models/student.model';

@Component({
  selector: 'app-subject-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './subject-form.component.html',
  styleUrl: './subject-form.component.scss'
})
export class SubjectFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private subjectsService = inject(SubjectsService);
  private coursesService = inject(CoursesService);
  private lecturersService = inject(LecturersService);
  private studentsService = inject(StudentsService);

  subjectForm: FormGroup = this.fb.group({
    name: ['', Validators.required],
    description: [''],
    course: ['', Validators.required],
    lecturer: ['', Validators.required]
  });

  isEdit = false;
  subjectId: number | null = null;
  loading = false;
  courses: Course[] = [];
  lecturers: Lecturer[] = [];
  allStudents: Student[] = [];
  filteredStudents: Student[] = [];
  selectedStudents: number[] = [];

  ngOnInit(): void {
    this.loadCourses();
    this.loadLecturers();
    this.loadStudents();

    const id = this.route.snapshot.paramMap.get('id');
    if (id && id !== 'new') {
      this.isEdit = true;
      this.subjectId = +id;
      this.loadSubject(+id);
    }
  }

  loadCourses(): void {
    this.coursesService.getCourses().subscribe({
      next: (courses) => this.courses = courses,
      error: (err) => console.error('Failed to load courses:', err)
    });
  }

  loadLecturers(): void {
    this.lecturersService.getLecturers().subscribe({
      next: (lecturers) => this.lecturers = lecturers,
      error: (err) => console.error('Failed to load lecturers:', err)
    });
  }

  loadStudents(): void {
    this.studentsService.getStudents().subscribe({
      next: (students) => {
        this.allStudents = students;
        this.filterStudents();
      },
      error: (err) => console.error('Failed to load students:', err)
    });
  }

  loadSubject(id: number): void {
    this.subjectsService.getSubject(id).subscribe({
      next: (subject: SubjectDetail) => {
        this.subjectForm.patchValue({
          name: subject.name,
          description: subject.description,
          course: subject.course.id,
          lecturer: subject.lecturer.id
        });
        this.selectedStudents = subject.students.map(s => s.id);
        this.filterStudents();
      },
      error: (err) => console.error('Failed to load subject:', err)
    });
  }

  onCourseChange(): void {
    this.filterStudents();
    // Clear students that don't belong to the new course
    const courseId = +this.subjectForm.get('course')?.value;
    this.selectedStudents = this.selectedStudents.filter(id =>
      this.allStudents.find(s => s.id === id && s.course === courseId)
    );
  }

  filterStudents(): void {
    const courseId = +this.subjectForm.get('course')?.value;
    if (courseId) {
      this.filteredStudents = this.allStudents.filter(s => s.course === courseId);
    } else {
      this.filteredStudents = [];
    }
  }

  isStudentSelected(studentId: number): boolean {
    return this.selectedStudents.includes(studentId);
  }

  toggleStudent(studentId: number): void {
    const index = this.selectedStudents.indexOf(studentId);
    if (index > -1) {
      this.selectedStudents.splice(index, 1);
    } else {
      this.selectedStudents.push(studentId);
    }
  }

  onSubmit(): void {
    if (this.subjectForm.invalid) return;

    this.loading = true;
    const subjectData: Partial<Subject> = {
      ...this.subjectForm.value,
      course: +this.subjectForm.value.course,
      lecturer: +this.subjectForm.value.lecturer,
      students: this.selectedStudents
    };

    const request = this.isEdit && this.subjectId
      ? this.subjectsService.updateSubject(this.subjectId, subjectData)
      : this.subjectsService.createSubject(subjectData);

    request.subscribe({
      next: () => {
        void this.router.navigate(['/dashboard/subjects']);
      },
      error: (err) => {
        this.loading = false;
        console.error('Failed to save subject:', err);
        alert(err.error?.detail || 'Failed to save subject. Please try again.');
      }
    });
  }

  goBack(): void {
    void this.router.navigate(['/dashboard/subjects']);
  }
}
