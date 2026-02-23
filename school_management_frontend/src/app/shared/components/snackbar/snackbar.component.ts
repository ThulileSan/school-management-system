import { Component, inject, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { SnackbarService, SnackbarMessage } from '../../services/snackbar.service';

@Component({
  selector: 'app-snackbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './snackbar.component.html',
  styleUrl: './snackbar.component.scss'
})
export class SnackbarComponent implements OnInit, OnDestroy {
  private snackbarService = inject(SnackbarService);
  private cdr = inject(ChangeDetectorRef);
  private subscription!: Subscription;
  private timeout: ReturnType<typeof setTimeout> | null = null;

  message: SnackbarMessage | null = null;
  visible = false;

  ngOnInit(): void {
    this.subscription = this.snackbarService.message$.subscribe((msg) => {
      this.message = msg;
      this.visible = true;
      this.cdr.markForCheck();

      if (this.timeout) clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        this.visible = false;
        this.cdr.markForCheck();
      }, 4000);
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
    if (this.timeout) clearTimeout(this.timeout);
  }

  dismiss(): void {
    this.visible = false;
    if (this.timeout) clearTimeout(this.timeout);
  }
}
