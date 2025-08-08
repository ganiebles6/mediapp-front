import { Component, Input, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatePipe } from '@angular/common';

/**
 * Componente de tabla reutilizable y tipada para Angular Standalone
 * @template T Tipo de los datos de la tabla
 */
@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule],
  providers: [DatePipe],
  template: `
    <div class="overflow-x-auto rounded-lg border border-gray-200">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-teal-900 text-left text-xs font-semibold text-white uppercase">
          <tr>
            <th *ngFor="let col of columns" 
                class="px-4 py-3"
                [ngClass]="{ 'text-center': isAccionesColumn(col.header) }">
              {{ col.header }}
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr *ngFor="let row of pagedRows" class="hover:bg-gray-50 transition">
            <td *ngFor="let col of columns" 
                class="px-4 py-3"
                [ngClass]="{ 'text-center': isAccionesColumn(col.header) }">
              <ng-container *ngIf="!col.cellTemplate; else customCellTpl">
      {{ formatCell(getCellValue(row, col.field)) }}
    </ng-container>
    <ng-template #customCellTpl>
      <ng-container *ngTemplateOutlet="col.cellTemplate; context: getTemplateContext(row)"></ng-container>
    </ng-template>
  </td>
          </tr>
        </tbody>
      </table>
      <div class="flex items-center justify-between px-4 py-2 bg-white border-t border-gray-200" *ngIf="totalPages > 1">
        <div class="text-xs text-gray-600">
          Página <span class="font-semibold">{{ currentPage + 1 }}</span> de <span class="font-semibold">{{ totalPages }}</span>
        </div>
        <nav class="inline-flex rounded-md shadow-sm isolate" aria-label="Pagination">
          <button (click)="prevPage()"
                  [disabled]="currentPage === 0"
                  class="relative inline-flex items-center px-2 py-1 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-10 focus:outline-none disabled:opacity-40 disabled:cursor-not-allowed">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/></svg>
          </button>
          <ng-container *ngFor="let page of [].constructor(totalPages); let i = index">
            <button (click)="goToPage(i)"
                    [ngClass]="i === currentPage ? 'bg-teal-900 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'"
                    class="relative inline-flex items-center px-3 py-1 border-t border-b border-gray-300 text-sm font-medium focus:z-10 focus:outline-none"
                    [class.font-semibold]="i === currentPage">
              {{ i + 1 }}
            </button>
          </ng-container>
          <button (click)="nextPage()"
                  [disabled]="currentPage >= totalPages - 1"
                  class="relative inline-flex items-center px-2 py-1 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-10 focus:outline-none disabled:opacity-40 disabled:cursor-not-allowed">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg>
          </button>
        </nav>
      </div>
    </div>
  `
})
export class TableComponent<T = unknown> {
  goToPage(page: number) {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page;
    }
  }
  @Input() pageSize: number = 5;
  currentPage: number = 0;

  get pagedRows() {
    const start = this.currentPage * this.pageSize;
    return this.rows.slice(start, start + this.pageSize);
  }

  get totalPages() {
    return Math.ceil(this.rows.length / this.pageSize);
  }

  nextPage() {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
    }
  }

  prevPage() {
    if (this.currentPage > 0) {
      this.currentPage--;
    }
  }

  ngOnChanges() {
    // Reset page if data changes
    this.currentPage = 0;
  }
  @Input() columns: Array<{ header: string; field: string; cellTemplate?: TemplateRef<T> }> = [];
  @Input() rows: T[] = [];

  constructor(private datePipe: DatePipe) {}

  isAccionesColumn(header: string): boolean {
    return header.trim().toLowerCase() === 'acciones';
  }

  getCellValue(row: T, field: string): unknown {
    return (row as Record<string, unknown>)[field];
  }

  formatCell(value: T[keyof T] | unknown): string {
    if (value instanceof Date) {
      return this.datePipe.transform(value, 'dd/MM/yyyy HH:mm:ss') || '';
    }
    if (typeof value === 'string' && !isNaN(Date.parse(value))) {
      const date = new Date(value);
      return this.datePipe.transform(date, 'dd/MM/yyyy HH:mm:ss') || '';
    }
    return String(value ?? '');
  }

  getTemplateContext(row: T): any {
    return { $implicit: row };
  }
}
