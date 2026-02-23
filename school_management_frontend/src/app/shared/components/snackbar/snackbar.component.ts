import { Component, inject, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { SnackbarService, SnackbarMessage, SnackbarConfirm } from '../../services/snackbar.service';

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
  private msgSub!: Subscription;
  private confirmSub!: Subscription;
  private timeout: ReturnType<typeof setTimeout> | null = null;

  message: SnackbarMessage | null = null;
  visible = false;

  confirmData: SnackbarConfirm | null = null;
  confirmVisible = false;

  ngOnInit(): void {
    this.msgSub = this.snackbarService.message$.subscribe((msg) => {
      this.message = msg;
      this.visible = true;
      this.cdr.markForCheck();

      if (this.timeout) clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        this.visible = false;
        this.cdr.markForCheck();
      }, 4000);
    });

    this.confirmSub = this.snackbarService.confirm$.subscribe((data) => {
      this.confirmData = data;
      this.confirmVisible = true;
      this.cdr.markForCheck();
    });
  }

  ngOnDestroy(): void {
    this.msgSub?.unsubscribe();
    this.confirmSub?.unsubscribe();
    if (this.timeout) clearTimeout(this.timeout);
  }

  dismiss(): void {
    this.visible = false;
    if (this.timeout) clearTimeout(this.timeout);
  }

  onConfirm(): void {
    this.confirmData?.resolve(true);
    this.confirmVisible = false;
    this.confirmData = null;
    this.cdr.markForCheck();
  }

  onCancel(): void {
    this.confirmData?.resolve(false);
    this.confirmVisible = false;
    this.confirmData = null;
    this.cdr.markForCheck();
  }
}
