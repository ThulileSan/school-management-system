import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Lecturer, LecturerDetail } from '../../models/lecturer.model';

@Injectable({
  providedIn: 'root'
})
export class LecturersService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiBaseUrl}/lecturers`;

  getLecturers(): Observable<Lecturer[]> {
    return this.http.get<Lecturer[]>(this.apiUrl);
  }

  getLecturer(id: number): Observable<LecturerDetail> {
    return this.http.get<LecturerDetail>(`${this.apiUrl}/${id}/`);
  }

  createLecturer(lecturer: Partial<Lecturer>): Observable<Lecturer> {
    return this.http.post<Lecturer>(this.apiUrl + '/', lecturer);
  }

  updateLecturer(id: number, lecturer: Partial<Lecturer>): Observable<Lecturer> {
    return this.http.put<Lecturer>(`${this.apiUrl}/${id}/`, lecturer);
  }

  deleteLecturer(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}/`);
  }
}
