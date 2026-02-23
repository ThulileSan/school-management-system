import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LecturersService } from '../../../../core/services/lecturers.service';
import { Lecturer } from '../../../../models/lecturer.model';
import { LoadingSpinnerComponent } from '../../../../shared/components/loading-spinner/loading-spinner.component';
import { NoDataComponent } from '../../../../shared/components/no-data/no-data.component';
import { SnackbarService } from '../../../../shared/services/snackbar.service';

@Component({
  selector: 'app-lecturer-list',
  standalone: true,
  imports: [CommonModule, LoadingSpinnerComponent, NoDataComponent],
  templateUrl: './lecturer-list.component.html',
  styleUrl: './lecturer-list.component.scss'
})
export class LecturerListComponent implements OnInit {
  private lecturersService = inject(LecturersService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);
  private snackbar = inject(SnackbarService);

  lecturers: Lecturer[] = [];
  loading = true;
  currentPage = 1;
  pageSize = 5;

  ngOnInit(): void {
    this.loadLecturers();
  }

  loadLecturers(): void {
    this.loading = true;
    this.lecturersService.getLecturers().subscribe({
      next: (lecturers) => {
        this.lecturers = lecturers;
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Failed to load lecturers:', err);
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
  }

  get paginatedLecturers(): Lecturer[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.lecturers.slice(start, start + this.pageSize);
  }

  get totalPages(): number {
    return Math.ceil(this.lecturers.length / this.pageSize);
  }

  goToPage(page: number): void {
    this.currentPage = page;
  }

  viewLecturer(id: number): void {
    void this.router.navigate(['/dashboard/lecturers', id]);
  }

  editLecturer(id: number): void {
    void this.router.navigate(['/dashboard/lecturers', id, 'edit']);
  }

  createLecturer(): void {
    void this.router.navigate(['/dashboard/lecturers', 'new']);
  }

  deleteLecturer(id: number): void {
    if (confirm('Are you sure you want to delete this lecturer?')) {
      this.lecturersService.deleteLecturer(id).subscribe({
        next: () => {
          this.snackbar.success('Lecturer deleted successfully.');
          this.loadLecturers();
        },
        error: (err) => {
          console.error('Failed to delete lecturer:', err);
          this.snackbar.error(err.error?.detail || 'Failed to delete lecturer. They may be assigned to subjects.');
        }
      });
    }
  }
}
