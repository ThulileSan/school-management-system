import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CoursesService } from '../../../../core/services/courses.service';
import { CourseDetail } from '../../../../models/course.model';

@Component({
  selector: 'app-course-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './course-detail.component.html',
  styleUrl: './course-detail.component.scss'
})
export class CourseDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private coursesService = inject(CoursesService);

  course: CourseDetail | null = null;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadCourse(+id);
    }
  }

  loadCourse(id: number): void {
    this.coursesService.getCourse(id).subscribe({
      next: (course) => this.course = course,
      error: (err) => console.error('Failed to load course:', err)
    });
  }

  editCourse(): void {
    if (this.course) {
      void this.router.navigate(['/dashboard/courses', this.course.id, 'edit']);
    }
  }

  goBack(): void {
    void this.router.navigate(['/dashboard/courses']);
  }
}
