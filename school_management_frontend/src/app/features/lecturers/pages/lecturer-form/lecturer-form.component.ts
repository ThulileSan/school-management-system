import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LecturersService } from '../../../../core/services/lecturers.service';
import { Lecturer } from '../../../../models/lecturer.model';
import { SnackbarService } from '../../../../shared/services/snackbar.service';

@Component({
  selector: 'app-lecturer-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './lecturer-form.component.html',
  styleUrl: './lecturer-form.component.scss'
})
export class LecturerFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private lecturersService = inject(LecturersService);
  private cdr = inject(ChangeDetectorRef);
  private snackbar = inject(SnackbarService);

  lecturerForm: FormGroup = this.fb.group({
    first_name: ['', Validators.required],
    last_name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]]
  });

  isEdit = false;
  lecturerId: number | null = null;
  loading = false;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id && id !== 'new') {
      this.isEdit = true;
      this.lecturerId = +id;
      this.loadLecturer(+id);
    }
  }

  loadLecturer(id: number): void {
    this.lecturersService.getLecturer(id).subscribe({
      next: (lecturer) => {
        this.lecturerForm.patchValue({
          first_name: lecturer.first_name,
          last_name: lecturer.last_name,
          email: lecturer.email
        });
      },
      error: (err) => console.error('Failed to load lecturer:', err)
    });
  }

  onSubmit(): void {
    if (this.lecturerForm.invalid) return;

    this.loading = true;
    const lecturerData: Partial<Lecturer> = this.lecturerForm.value;

    const request = this.isEdit && this.lecturerId
      ? this.lecturersService.updateLecturer(this.lecturerId, lecturerData)
      : this.lecturersService.createLecturer(lecturerData);

    request.subscribe({
      next: () => {
        void this.router.navigate(['/dashboard/lecturers']);
      },
      error: (err) => {
        this.loading = false;
        this.cdr.markForCheck();
        console.error('Failed to save lecturer:', err);
        this.snackbar.error(err.error?.detail || 'Failed to save lecturer. Please try again.');
      }
    });
  }

  goBack(): void {
    void this.router.navigate(['/dashboard/lecturers']);
  }
}
