import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CoursesService } from '../../../../core/services/courses.service';
import { Course } from '../../../../models/course.model';
import { LoadingSpinnerComponent } from '../../../../shared/components/loading-spinner/loading-spinner.component';
import { NoDataComponent } from '../../../../shared/components/no-data/no-data.component';
import { SnackbarService } from '../../../../shared/services/snackbar.service';

@Component({
  selector: 'app-course-list',
  standalone: true,
  imports: [CommonModule, FormsModule, LoadingSpinnerComponent, NoDataComponent],
  templateUrl: './course-list.component.html',
  styleUrl: './course-list.component.scss'
})
export class CourseListComponent implements OnInit {
  private coursesService = inject(CoursesService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);
  private snackbar = inject(SnackbarService);

  courses: Course[] = [];
  loading = true;
  currentPage = 1;
  pageSize = 8;
  searchTerm = '';

  ngOnInit(): void {
    this.loadCourses();
  }

  loadCourses(): void {
    this.loading = true;
    this.coursesService.getCourses().subscribe({
      next: (courses) => {
        this.courses = courses.sort((a, b) => a.name.localeCompare(b.name));
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Failed to load courses:', err);
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
  }

  get filteredCourses(): Course[] {
    if (!this.searchTerm.trim()) return this.courses;
    const term = this.searchTerm.toLowerCase();
    return this.courses.filter(c =>
      c.name.toLowerCase().includes(term) ||
      c.description.toLowerCase().includes(term)
    );
  }

  get paginatedCourses(): Course[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredCourses.slice(start, start + this.pageSize);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredCourses.length / this.pageSize);
  }

  onSearch(): void {
    this.currentPage = 1;
  }

  goToPage(page: number): void {
    this.currentPage = page;
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

  async deleteCourse(id: number): Promise<void> {
    const confirmed = await this.snackbar.confirm('Are you sure you want to delete this course?');
    if (!confirmed) return;

    this.coursesService.deleteCourse(id).subscribe({
      next: () => {
        this.snackbar.success('Course deleted successfully.');
        this.loadCourses();
      },
      error: (err) => {
        console.error('Failed to delete course:', err);
        this.snackbar.error(err.error?.detail || 'Failed to delete course. It may have enrolled students.');
      }
    });
  }
}
