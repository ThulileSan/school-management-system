import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SubjectsService } from '../../../../core/services/subjects.service';
import { Subject } from '../../../../models/subject.model';
import { LoadingSpinnerComponent } from '../../../../shared/components/loading-spinner/loading-spinner.component';
import { NoDataComponent } from '../../../../shared/components/no-data/no-data.component';
import { SnackbarService } from '../../../../shared/services/snackbar.service';

@Component({
  selector: 'app-subject-list',
  standalone: true,
  imports: [CommonModule, FormsModule, LoadingSpinnerComponent, NoDataComponent],
  templateUrl: './subject-list.component.html',
  styleUrl: './subject-list.component.scss'
})
export class SubjectListComponent implements OnInit {
  private subjectsService = inject(SubjectsService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);
  private snackbar = inject(SnackbarService);

  subjects: Subject[] = [];
  loading = true;
  currentPage = 1;
  pageSize = 8;
  searchTerm = '';

  ngOnInit(): void {
    this.loadSubjects();
  }

  loadSubjects(): void {
    this.loading = true;
    this.subjectsService.getSubjects().subscribe({
      next: (subjects) => {
        this.subjects = subjects.sort((a, b) => a.name.localeCompare(b.name));
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Failed to load subjects:', err);
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
  }

  get filteredSubjects(): Subject[] {
    if (!this.searchTerm.trim()) return this.subjects;
    const term = this.searchTerm.toLowerCase();
    return this.subjects.filter(s =>
      s.name.toLowerCase().includes(term) ||
      s.description.toLowerCase().includes(term)
    );
  }

  get paginatedSubjects(): Subject[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredSubjects.slice(start, start + this.pageSize);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredSubjects.length / this.pageSize);
  }

  onSearch(): void {
    this.currentPage = 1;
  }

  goToPage(page: number): void {
    this.currentPage = page;
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

  async deleteSubject(id: number): Promise<void> {
    const confirmed = await this.snackbar.confirm('Are you sure you want to delete this subject?');
    if (!confirmed) return;

    this.subjectsService.deleteSubject(id).subscribe({
      next: () => {
        this.snackbar.success('Subject deleted successfully.');
        this.loadSubjects();
      },
      error: (err) => {
        console.error('Failed to delete subject:', err);
        this.snackbar.error(err.error?.detail || 'Failed to delete subject.');
      }
    });
  }
}
