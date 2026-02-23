import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { LecturersService } from '../../../../core/services/lecturers.service';
import { LecturerDetail } from '../../../../models/lecturer.model';

@Component({
  selector: 'app-lecturer-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './lecturer-detail.component.html',
  styleUrl: './lecturer-detail.component.scss'
})
export class LecturerDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private lecturersService = inject(LecturersService);
  private cdr = inject(ChangeDetectorRef);

  lecturer: LecturerDetail | null = null;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadLecturer(+id);
    }
  }

  loadLecturer(id: number): void {
    this.lecturersService.getLecturer(id).subscribe({
      next: (lecturer) => { this.lecturer = lecturer; this.cdr.markForCheck(); },
      error: (err) => console.error('Failed to load lecturer:', err)
    });
  }

  editLecturer(): void {
    if (this.lecturer) {
      void this.router.navigate(['/dashboard/lecturers', this.lecturer.id, 'edit']);
    }
  }

  goBack(): void {
    void this.router.navigate(['/dashboard/lecturers']);
  }
}
