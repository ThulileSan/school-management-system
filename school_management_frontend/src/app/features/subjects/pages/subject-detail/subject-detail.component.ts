import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { SubjectsService } from '../../../../core/services/subjects.service';
import { SubjectDetail } from '../../../../models/subject.model';

@Component({
  selector: 'app-subject-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './subject-detail.component.html',
  styleUrl: './subject-detail.component.scss'
})
export class SubjectDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private subjectsService = inject(SubjectsService);
  private cdr = inject(ChangeDetectorRef);

  subject: SubjectDetail | null = null;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadSubject(+id);
    }
  }

  loadSubject(id: number): void {
    this.subjectsService.getSubject(id).subscribe({
      next: (subject) => { this.subject = subject; this.cdr.markForCheck(); },
      error: (err) => console.error('Failed to load subject:', err)
    });
  }

  editSubject(): void {
    if (this.subject) {
      void this.router.navigate(['/dashboard/subjects', this.subject.id, 'edit']);
    }
  }

  goBack(): void {
    void this.router.navigate(['/dashboard/subjects']);
  }
}
