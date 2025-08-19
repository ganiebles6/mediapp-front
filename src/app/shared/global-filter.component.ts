import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-global-filter',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <form class="flex flex-wrap gap-4 items-end mb-6" (ngSubmit)="emitFilter()">
      <!-- Fecha inicio -->
      <div>
        <label class="block text-sm font-medium mb-1">Fecha inicio</label>
        <input type="date" [(ngModel)]="filter.fechaInicio" name="fechaInicio" class="border rounded px-2 py-1" />
      </div>
      <!-- Fecha fin -->
      <div>
        <label class="block text-sm font-medium mb-1">Fecha fin</label>
        <input type="date" [(ngModel)]="filter.fechaFin" name="fechaFin" class="border rounded px-2 py-1" />
      </div>
      <!-- Estado -->
      <div>
        <label class="block text-sm font-medium mb-1">Estado</label>
        <select [(ngModel)]="filter.estado" name="estado" class="border rounded px-2 py-1">
          <option value="todos">Todos</option>
          <option value="activo">Activo</option>
          <option value="inactivo">Inactivo</option>
        </select>
      </div>
      <!-- Texto -->
      <div>
        <label class="block text-sm font-medium mb-1">Buscar</label>
        <input type="text" [(ngModel)]="filter.texto" name="texto" placeholder="Buscar..." class="border rounded px-2 py-1" />
      </div>
      <button type="submit" class="bg-teal-900 text-white px-4 py-2 rounded">Filtrar</button>
      <button type="button" (click)="resetFilter()" class="bg-gray-300 px-4 py-2 rounded ml-2">Limpiar</button>
    </form>
  `
})
export class GlobalFilterComponent {
  @Input() camposExtra: string[] = [];
  @Output() filterChange = new EventEmitter<any>();

  filter: any = {
    fechaInicio: '',
    fechaFin: '',
    estado: 'todos',
    texto: ''
    // Puedes agregar campos extra aquí si lo necesitas
  };

  emitFilter() {
    this.filterChange.emit({ ...this.filter });
  }

  resetFilter() {
    this.filter = {
      fechaInicio: '',
      fechaFin: '',
      estado: 'todos',
      texto: ''
    };
    this.emitFilter();
  }
}
