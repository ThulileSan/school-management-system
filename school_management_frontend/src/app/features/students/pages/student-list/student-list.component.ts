import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { StudentsService } from '../../../../core/services/students.service';
import { Student } from '../../../../models/student.model';
import { LoadingSpinnerComponent } from '../../../../shared/components/loading-spinner/loading-spinner.component';
import { NoDataComponent } from '../../../../shared/components/no-data/no-data.component';

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

  students: Student[] = [];
  loading = true;

  ngOnInit(): void {
    this.loadStudents();
  }

  loadStudents(): void {
    this.loading = true;
    this.studentsService.getStudents().subscribe({
      next: (students) => {
        this.students = students;
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load students:', err);
        this.loading = false;
      }
    });
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

  deleteStudent(id: number): void {
    if (confirm('Are you sure you want to delete this student?')) {
      this.studentsService.deleteStudent(id).subscribe({
        next: () => this.loadStudents(),
        error: (err) => console.error('Failed to delete student:', err)
      });
    }
  }
}
