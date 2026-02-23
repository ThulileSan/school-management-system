import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface SnackbarMessage {
  text: string;
  type: 'success' | 'error' | 'info';
}

export interface SnackbarConfirm {
  text: string;
  resolve: (confirmed: boolean) => void;
}

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {
  private messageSubject = new Subject<SnackbarMessage>();
  private confirmSubject = new Subject<SnackbarConfirm>();
  message$ = this.messageSubject.asObservable();
  confirm$ = this.confirmSubject.asObservable();

  success(text: string): void {
    this.messageSubject.next({ text, type: 'success' });
  }

  error(text: string): void {
    this.messageSubject.next({ text, type: 'error' });
  }

  info(text: string): void {
    this.messageSubject.next({ text, type: 'info' });
  }

  confirm(text: string): Promise<boolean> {
    return new Promise((resolve) => {
      this.confirmSubject.next({ text, resolve });
    });
  }
}
