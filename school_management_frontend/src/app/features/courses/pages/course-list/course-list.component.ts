import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { CoursesService } from '../../../../core/services/courses.service';
import { Course } from '../../../../models/course.model';
import { LoadingSpinnerComponent } from '../../../../shared/components/loading-spinner/loading-spinner.component';
import { NoDataComponent } from '../../../../shared/components/no-data/no-data.component';

@Component({
  selector: 'app-course-list',
  standalone: true,
  imports: [CommonModule, RouterModule, LoadingSpinnerComponent, NoDataComponent],
  templateUrl: './course-list.component.html',
  styleUrl: './course-list.component.scss'
})
export class CourseListComponent implements OnInit {
  private coursesService = inject(CoursesService);
  private router = inject(Router);

  courses: Course[] = [];
  loading = true;

  ngOnInit(): void {
    this.loadCourses();
  }

  loadCourses(): void {
    this.loading = true;
    this.coursesService.getCourses().subscribe({
      next: (courses) => {
        this.courses = courses;
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load courses:', err);
        this.loading = false;
      }
    });
  }

  viewCourse(id: number): void {
    void this.router.navigate(['/dashboard/courses', id]);
  }

  editCourse(id: number): void {
    void this.router.navigate(['/dashboard/courses', id, 'edit']);
  }

  createCourse(): void {
    void this.router.navigate(['/dashboard/courses', 'new']);
  }

  deleteCourse(id: number): void {
    if (confirm('Are you sure you want to delete this course?')) {
      this.coursesService.deleteCourse(id).subscribe({
        next: () => this.loadCourses(),
        error: (err) => {
          console.error('Failed to delete course:', err);
          alert(err.error?.detail || 'Failed to delete course. It may have enrolled students.');
        }
      });
    }
  }
}
