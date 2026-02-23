import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface SnackbarMessage {
  text: string;
  type: 'success' | 'error' | 'info';
}

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {
  private messageSubject = new Subject<SnackbarMessage>();
  message$ = this.messageSubject.asObservable();

  success(text: string): void {
    this.messageSubject.next({ text, type: 'success' });
  }

  error(text: string): void {
    this.messageSubject.next({ text, type: 'error' });
  }

  info(text: string): void {
    this.messageSubject.next({ text, type: 'info' });
  }
}
