import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/pages/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'dashboard',
    canActivate: [AuthGuard],
    loadComponent: () => import('./features/dashboard/layout/admin-layout/admin-layout.component').then(m => m.AdminLayoutComponent),
    children: [
      { path: '', redirectTo: 'students', pathMatch: 'full' },

      // Students
      {
        path: 'students',
        loadComponent: () => import('./features/students/pages/student-list/student-list.component').then(m => m.StudentListComponent)
      },
      {
        path: 'students/new',
        loadComponent: () => import('./features/students/pages/student-form/student-form.component').then(m => m.StudentFormComponent)
      },
      {
        path: 'students/:id',
        loadComponent: () => import('./features/students/pages/student-detail/student-detail.component').then(m => m.StudentDetailComponent)
      },
      {
        path: 'students/:id/edit',
        loadComponent: () => import('./features/students/pages/student-form/student-form.component').then(m => m.StudentFormComponent)
      },

      // Courses
      {
        path: 'courses',
        loadComponent: () => import('./features/courses/pages/course-list/course-list.component').then(m => m.CourseListComponent)
      },
      {
        path: 'courses/new',
        loadComponent: () => import('./features/courses/pages/course-form/course-form.component').then(m => m.CourseFormComponent)
      },
      {
        path: 'courses/:id',
        loadComponent: () => import('./features/courses/pages/course-detail/course-detail.component').then(m => m.CourseDetailComponent)
      },
      {
        path: 'courses/:id/edit',
        loadComponent: () => import('./features/courses/pages/course-form/course-form.component').then(m => m.CourseFormComponent)
      },

      // Lecturers
      {
        path: 'lecturers',
        loadComponent: () => import('./features/lecturers/pages/lecturer-list/lecturer-list.component').then(m => m.LecturerListComponent)
      },
      {
        path: 'lecturers/new',
        loadComponent: () => import('./features/lecturers/pages/lecturer-form/lecturer-form.component').then(m => m.LecturerFormComponent)
      },
      {
        path: 'lecturers/:id',
        loadComponent: () => import('./features/lecturers/pages/lecturer-detail/lecturer-detail.component').then(m => m.LecturerDetailComponent)
      },
      {
        path: 'lecturers/:id/edit',
        loadComponent: () => import('./features/lecturers/pages/lecturer-form/lecturer-form.component').then(m => m.LecturerFormComponent)
      },

      // Subjects
      {
        path: 'subjects',
        loadComponent: () => import('./features/subjects/pages/subject-list/subject-list.component').then(m => m.SubjectListComponent)
      },
      {
        path: 'subjects/new',
        loadComponent: () => import('./features/subjects/pages/subject-form/subject-form.component').then(m => m.SubjectFormComponent)
      },
      {
        path: 'subjects/:id',
        loadComponent: () => import('./features/subjects/pages/subject-detail/subject-detail.component').then(m => m.SubjectDetailComponent)
      },
      {
        path: 'subjects/:id/edit',
        loadComponent: () => import('./features/subjects/pages/subject-form/subject-form.component').then(m => m.SubjectFormComponent)
      }
    ]
  }
];
