import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { StudentsService } from '../../../../core/services/students.service';
import { StudentDetail } from '../../../../models/student.model';

@Component({
  selector: 'app-student-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './student-detail.component.html',
  styleUrl: './student-detail.component.scss'
})
export class StudentDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private studentsService = inject(StudentsService);
  private cdr = inject(ChangeDetectorRef);

  student: StudentDetail | null = null;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadStudent(+id);
    }
  }

  loadStudent(id: number): void {
    this.studentsService.getStudent(id).subscribe({
      next: (student) => { this.student = student; this.cdr.markForCheck(); },
      error: (err) => console.error('Failed to load student:', err)
    });
  }

  editStudent(): void {
    if (this.student) {
      void this.router.navigate(['/dashboard/students', this.student.id, 'edit']);
    }
  }

  goBack(): void {
    void this.router.navigate(['/dashboard/students']);
  }
}
