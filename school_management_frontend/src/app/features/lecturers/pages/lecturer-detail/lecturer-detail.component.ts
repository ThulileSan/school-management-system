import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { LecturersService } from '../../../../core/services/lecturers.service';
import { LecturerDetail } from '../../../../models/lecturer.model';

@Component({
  selector: 'app-lecturer-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './lecturer-detail.component.html',
  styleUrl: './lecturer-detail.component.scss'
})
export class LecturerDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private lecturersService = inject(LecturersService);

  lecturer: LecturerDetail | null = null;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadLecturer(+id);
    }
  }

  loadLecturer(id: number): void {
    this.lecturersService.getLecturer(id).subscribe({
      next: (lecturer) => this.lecturer = lecturer,
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
