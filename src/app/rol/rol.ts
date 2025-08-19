import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GlobalFilterComponent } from '../shared/global-filter.component';
import { TableComponent } from '../shared/table.component';
import { ToastComponent } from '../shared/toast.component';
import { ConfirmDialogComponent } from '../shared/confirm-dialog.component';
import { RolService } from './rol.service';
import { Rol as RolModel } from 'models/rol.model';

@Component({
  selector: 'app-rol',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    GlobalFilterComponent,
    TableComponent,
    ToastComponent,
    ConfirmDialogComponent
  ],
  templateUrl: './rol.html',
  styleUrl: './rol.css'
})
export class RolComponent implements OnInit {
  // Referencia al template de acciones
  @ViewChild('accionesTemplate', { static: false }) accionesTemplate!: any;
  toastVisible: boolean = false;
  toastType: string = '';
  toastTitle: string = '';
  toastMessage: string = '';

  public tableColumns: Array<{ header: string; field: string; cellTemplate?: any }> = [
    { header: '', field: 'checkbox' },
    { header: 'Nombre', field: 'nombre' },
    { header: 'Descripción', field: 'descripcion' },
    { header: 'Acciones', field: 'acciones', cellTemplate: undefined }
  ];

  // ...existing code...
  roles: RolModel[] = [];
  rolesFiltrados: RolModel[] = [];
  rolObject: RolModel = {
    idRol: 0,
    nombre: '',
    descripcion: ''
  };
  editMode: boolean = false;
  showFormRol: boolean = false;
  showConfirm: boolean = false;

  constructor(private rolService: RolService) {}

  ngOnInit(): void {
    // Asignar el template de acciones a la columna correspondiente
    const accionesCol = this.tableColumns.find(col => col.field === 'acciones');
    if (accionesCol && this.accionesTemplate) {
      accionesCol.cellTemplate = this.accionesTemplate;
    }
    this.loadRoles();
    this.rolesFiltrados = [...this.roles];
  }


  ngAfterViewInit(): void {
    // Asignar el template de acciones a la columna correspondiente
    const accionesCol = this.tableColumns.find(col => col.field === 'acciones');
    if (accionesCol && this.accionesTemplate) {
      accionesCol.cellTemplate = this.accionesTemplate;
    }
  }

  loadRoles(): void {
    this.rolService.loadRoles().subscribe(() => {
      this.roles = this.rolService.roles;
      this.rolesFiltrados = [...this.roles];
    });
  }

  openNewRol() {
    this.resetRolForm();
    this.showFormRol = true;
  }

  onConfirmSave() {
    this.showConfirm = false;
    this.showFormRol = false;
    this.saveRol();
  }

  saveRol() {
    if (this.editMode) {
      this.rolService.update(this.rolObject).subscribe({
        next: () => {
          this.loadRoles();
          this.resetRolForm();
        },
        error: (err) => {
          console.error('Error al actualizar rol', err);
        }
      });
    } else {
      let newId = 1;
      if (this.roles.length > 0) {
        const lastRol = this.roles[this.roles.length - 1];
        newId = (lastRol.idRol || 0) + 1;
      }
      this.rolObject.idRol = newId;
      this.rolService.save(this.rolObject).subscribe({
        next: () => {
          this.loadRoles();
          this.resetRolForm();
        },
        error: (err) => {
          console.error('Error al crear rol', err);
        }
      });
    }
  }

  editRol(rol: RolModel) {
    this.rolObject = { ...rol };
    this.editMode = true;
    this.showFormRol = true;
  }

  deleteRol(rol: RolModel) {
    this.rolService.deleteRolService(rol.idRol).subscribe({
      next: () => {
        this.loadRoles();
      },
      error: (err) => {
        console.error('Error al eliminar rol', err);
      }
    });
  }

  resetRolForm() {
    this.rolObject = {
      idRol: 0,
      nombre: '',
      descripcion: ''
    };
    this.editMode = false;
  }

  aplicarFiltro(filtros: any) {
    this.rolesFiltrados = this.roles.filter(rol => {
      const textoValido = !filtros.texto || rol.nombre.toLowerCase().includes(filtros.texto.toLowerCase());
      return textoValido;
    });
  }
}
