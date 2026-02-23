import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CoursesService } from '../../../../core/services/courses.service';
import { Course } from '../../../../models/course.model';
import { SnackbarService } from '../../../../shared/services/snackbar.service';

@Component({
  selector: 'app-course-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './course-form.component.html',
  styleUrl: './course-form.component.scss'
})
export class CourseFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private coursesService = inject(CoursesService);
  private cdr = inject(ChangeDetectorRef);
  private snackbar = inject(SnackbarService);

  courseForm: FormGroup = this.fb.group({
    name: ['', Validators.required],
    description: ['']
  });

  isEdit = false;
  courseId: number | null = null;
  loading = false;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id && id !== 'new') {
      this.isEdit = true;
      this.courseId = +id;
      this.loadCourse(+id);
    }
  }

  loadCourse(id: number): void {
    this.coursesService.getCourse(id).subscribe({
      next: (course) => {
        this.courseForm.patchValue({
          name: course.name,
          description: course.description
        });
      },
      error: (err) => console.error('Failed to load course:', err)
    });
  }

  onSubmit(): void {
    if (this.courseForm.invalid) return;

    this.loading = true;
    const courseData: Partial<Course> = this.courseForm.value;

    const request = this.isEdit && this.courseId
      ? this.coursesService.updateCourse(this.courseId, courseData)
      : this.coursesService.createCourse(courseData);

    request.subscribe({
      next: () => {
        void this.router.navigate(['/dashboard/courses']);
      },
      error: (err) => {
        this.loading = false;
        this.cdr.markForCheck();
        console.error('Failed to save course:', err);
        this.snackbar.error(err.error?.detail || 'Failed to save course. Please try again.');
      }
    });
  }

  goBack(): void {
    void this.router.navigate(['/dashboard/courses']);
  }
}
