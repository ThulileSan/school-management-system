import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Subject, SubjectDetail } from '../../models/subject.model';

@Injectable({
  providedIn: 'root'
})
export class SubjectsService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiBaseUrl}/subjects/`;

  getSubjects(): Observable<Subject[]> {
    return this.http.get<Subject[]>(this.apiUrl);
  }

  getSubject(id: number): Observable<SubjectDetail> {
    return this.http.get<SubjectDetail>(`${this.apiUrl}${id}/`);
  }

  createSubject(subject: Partial<Subject>): Observable<Subject> {
    return this.http.post<Subject>(this.apiUrl, subject);
  }

  updateSubject(id: number, subject: Partial<Subject>): Observable<Subject> {
    return this.http.put<Subject>(`${this.apiUrl}${id}/`, subject);
  }

  deleteSubject(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}${id}/`);
  }
}
