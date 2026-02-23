import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { StudentsService } from '../../../../core/services/students.service';
import { Student } from '../../../../models/student.model';
import { LoadingSpinnerComponent } from '../../../../shared/components/loading-spinner/loading-spinner.component';
import { NoDataComponent } from '../../../../shared/components/no-data/no-data.component';
import { SnackbarService } from '../../../../shared/services/snackbar.service';

@Component({
  selector: 'app-student-list',
  standalone: true,
  imports: [CommonModule, LoadingSpinnerComponent, NoDataComponent],
  templateUrl: './student-list.component.html',
  styleUrl: './student-list.component.scss'
})
export class StudentListComponent implements OnInit {
  private studentsService = inject(StudentsService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);
  private snackbar = inject(SnackbarService);

  students: Student[] = [];
  loading = true;
  currentPage = 1;
  pageSize = 5;

  ngOnInit(): void {
    this.loadStudents();
  }

  loadStudents(): void {
    this.loading = true;
    this.studentsService.getStudents().subscribe({
      next: (students) => {
        this.students = students;
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Failed to load students:', err);
        this.loading = false;
      }
    });
  }

  get paginatedStudents(): Student[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.students.slice(start, start + this.pageSize);
  }

  get totalPages(): number {
    return Math.ceil(this.students.length / this.pageSize);
  }

  goToPage(page: number): void {
    this.currentPage = page;
  }

  viewStudent(id: number): void {
    void this.router.navigate(['/dashboard/students', id]);
  }

  editStudent(id: number): void {
    void this.router.navigate(['/dashboard/students', id, 'edit']);
  }

  createStudent(): void {
    void this.router.navigate(['/dashboard/students', 'new']);
  }

  async deleteStudent(id: number): Promise<void> {
    const confirmed = await this.snackbar.confirm('Are you sure you want to delete this student?');
    if (!confirmed) return;

    this.studentsService.deleteStudent(id).subscribe({
      next: () => {
        this.snackbar.success('Student deleted successfully.');
        this.loadStudents();
      },
      error: (err) => {
        console.error('Failed to delete student:', err);
        this.snackbar.error(err.error?.detail || 'Failed to delete student.');
      }
    });
  }
}
