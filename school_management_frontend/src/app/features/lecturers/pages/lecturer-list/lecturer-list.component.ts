import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LecturersService } from '../../../../core/services/lecturers.service';
import { Lecturer } from '../../../../models/lecturer.model';
import { LoadingSpinnerComponent } from '../../../../shared/components/loading-spinner/loading-spinner.component';
import { NoDataComponent } from '../../../../shared/components/no-data/no-data.component';

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

  lecturers: Lecturer[] = [];
  loading = true;

  ngOnInit(): void {
    this.loadLecturers();
  }

  loadLecturers(): void {
    this.loading = true;
    this.lecturersService.getLecturers().subscribe({
      next: (lecturers) => {
        this.lecturers = lecturers;
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load lecturers:', err);
        this.loading = false;
      }
    });
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
        next: () => this.loadLecturers(),
        error: (err) => {
          console.error('Failed to delete lecturer:', err);
          alert(err.error?.detail || 'Failed to delete lecturer. They may be assigned to subjects.');
        }
      });
    }
  }
}
