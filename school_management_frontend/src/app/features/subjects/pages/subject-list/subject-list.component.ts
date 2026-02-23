import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SubjectsService } from '../../../../core/services/subjects.service';
import { Subject } from '../../../../models/subject.model';
import { LoadingSpinnerComponent } from '../../../../shared/components/loading-spinner/loading-spinner.component';
import { NoDataComponent } from '../../../../shared/components/no-data/no-data.component';

@Component({
  selector: 'app-subject-list',
  standalone: true,
  imports: [CommonModule, LoadingSpinnerComponent, NoDataComponent],
  templateUrl: './subject-list.component.html',
  styleUrl: './subject-list.component.scss'
})
export class SubjectListComponent implements OnInit {
  private subjectsService = inject(SubjectsService);
  private router = inject(Router);

  subjects: Subject[] = [];
  loading = true;

  ngOnInit(): void {
    this.loadSubjects();
  }

  loadSubjects(): void {
    this.loading = true;
    this.subjectsService.getSubjects().subscribe({
      next: (subjects) => {
        this.subjects = subjects;
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load subjects:', err);
        this.loading = false;
      }
    });
  }

  viewSubject(id: number): void {
    void this.router.navigate(['/dashboard/subjects', id]);
  }

  editSubject(id: number): void {
    void this.router.navigate(['/dashboard/subjects', id, 'edit']);
  }

  createSubject(): void {
    void this.router.navigate(['/dashboard/subjects', 'new']);
  }

  deleteSubject(id: number): void {
    if (confirm('Are you sure you want to delete this subject?')) {
      this.subjectsService.deleteSubject(id).subscribe({
        next: () => this.loadSubjects(),
        error: (err) => {
          console.error('Failed to delete subject:', err);
          alert(err.error?.detail || 'Failed to delete subject. Please try again.');
        }
      });
    }
  }
}
