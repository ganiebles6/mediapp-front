import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="visible"
         [ngClass]="[toastClass, 'toast fixed top-6 right-6 z-50 flex items-start p-4 rounded-lg border shadow-lg min-w-[320px] max-w-xs transition-all duration-500', showAnimation ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none']"
         role="alert">
      <div class="flex-shrink-0">
        <ng-container *ngIf="type === 'success'; else errorIcon">
          <svg class="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
          </svg>
        </ng-container>
        <ng-template #errorIcon>
          <svg class="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M18 10A8 8 0 11 2 10a8 8 0 0116 0zm-4.293-2.293a1 1 0 00-1.414 0L10 9.586 7.707 7.293a1 1 0 00-1.414 1.414L8.586 11l-2.293 2.293a1 1 0 001.414 1.414L10 12.414l2.293 2.293a1 1 0 001.414-1.414L11.414 11l2.293-2.293a1 1 0 000-1.414z" clip-rule="evenodd"/>
          </svg>
        </ng-template>
      </div>
      <div class="ml-3 flex-1">
        <h3 class="text-sm font-medium" [ngClass]="type === 'success' ? 'text-green-800' : 'text-red-800'">{{ title }}</h3>
        <p class="mt-1 text-sm" [ngClass]="type === 'success' ? 'text-green-600' : 'text-red-600'">{{ message }}</p>
      </div>
      <button (click)="close()" class="ml-auto p-1 rounded text-green-400 hover:text-green-500 focus:outline-none" *ngIf="type === 'success'">
        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
        </svg>
      </button>
      <button (click)="close()" class="ml-auto p-1 rounded text-red-400 hover:text-red-500 focus:outline-none" *ngIf="type === 'error'">
        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
        </svg>
      </button>
    </div>
  `,
  styles: []
})
export class ToastComponent {
  showAnimation = false;
  @Input() visible = false;
  @Input() type: 'success' | 'error' = 'success';
  @Input() title = '';
  @Input() message = '';
  @Output() closed = new EventEmitter<void>();

  get toastClass() {
    return this.type === 'success'
      ? 'bg-green-100 text-green-900 border border-green-300'
      : 'bg-red-100 text-red-900 border border-red-300';
  }

  private autoCloseTimeout: any;

  ngOnChanges() {
    if (this.visible) {
      // Animación de entrada
      setTimeout(() => {
        this.showAnimation = true;
      }, 10);
      // Cierre automático después de 3 segundos
      clearTimeout(this.autoCloseTimeout);
      this.autoCloseTimeout = setTimeout(() => {
        this.hideToast();
      }, 3000);
    } else {
      this.showAnimation = false;
      clearTimeout(this.autoCloseTimeout);
    }
  }

  hideToast() {
    this.showAnimation = false;
    setTimeout(() => {
      this.visible = false;
      this.closed.emit();
    }, 500); // Espera a que termine la animación de salida
  }

  close() {
    this.hideToast();
  }
}
