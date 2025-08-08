import { ViewChild, TemplateRef, AfterViewInit, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Menu } from 'models/menu.model';
import { ApiService } from 'services/services-api';
import { ConfirmDialogComponent } from '../shared/confirm-dialog.component';
import { TableComponent } from '../shared/table.component';
import { ToastComponent } from 'app/shared/toast.component';

@Component({
  selector: 'app-menu',
  imports: [CommonModule, FormsModule, ConfirmDialogComponent, TableComponent, ToastComponent],
  standalone: true,
  templateUrl: './menu.html',
  styleUrl: './menu.css'
})
export class MenuComponent implements AfterViewInit {

  @ViewChild('accionesTemplate', { static: false }) accionesTemplate!: TemplateRef<any>;
  @ViewChild('estadoBadge', { static: false }) estadoBadge!: TemplateRef<any>;

  public tableColumns: Array<{ header: string; field: string; cellTemplate?: TemplateRef<Menu> }> = [
    { header: '', field: 'checkbox' },
    { header: 'Nombre', field: 'nombre' },
    { header: 'Ruta', field: 'url' },
    { header: 'Estado', field: 'estado', cellTemplate: undefined },
    { header: 'Icono', field: 'icono' },
    { header: 'Fecha creación', field: 'fechaCreacion' },
    { header: 'Acciones', field: 'acciones', cellTemplate: undefined }
  ];


  // Toast properties
  toastVisible: boolean = false;
  toastType: string = '';
  toastTitle: string = '';
  toastMessage: string = '';

  public tableRows: Menu[] = [];
  constructor(private menuService: ApiService) {}

  menus: Menu[] = [];
  filtro: string = "";
  menuObject: Menu = {
    idMenu: 0,
    nombre: '',
    descripcion: '',
    url: '',
    icono: '',
    estado: true,
    fechaCreacion: new Date(),
    fechaModificacion: new Date(),
    roles: []
  };
  editMode: boolean = false;
  showFormMenu: boolean = false;
  showConfirm: boolean = false;

  ngAfterViewInit(): void {
    // Asignar el template de acciones a la columna correspondiente
    const accionesCol = this.tableColumns.find(col => col.field === 'acciones');
    if (accionesCol && this.accionesTemplate) {
      accionesCol.cellTemplate = this.accionesTemplate;
    }
    // Asignar el template de estado a la columna correspondiente
    const estadoCol = this.tableColumns.find(col => col.field === 'estado');
    if (estadoCol && this.estadoBadge) {
      estadoCol.cellTemplate = this.estadoBadge;
    }
  }

  ngOnInit(): void {
    this.loadMenus();
  }

  onConfirmSave() {
    this.showConfirm = false;
    this.showFormMenu = false;
    this.saveMenu();
  }

  loadMenus(): void {
    this.menuService.get<Menu[]>("menu/getAll").subscribe({
      next: (data) => {
        this.menus = data;
      },
      error: (err) => {
        console.error('Error al cargar los menús', err);
      }
    });
  }

  saveMenu() {
    if (this.editMode) {
      // Actualizar menú existente
      this.menuService.put<Menu>(`menu/modify/${this.menuObject.idMenu}`, this.menuObject).subscribe({
        next: (data) => {
          this.loadMenus();
          this.toastType = 'success';
          this.toastTitle = 'Éxito';
          this.toastMessage = 'Menú actualizado correctamente';
          this.toastVisible = true;
          this.resetMenuForm();
        },
        error: (err) => {
          console.error('Error al actualizar menu', err);
        }
      });
    } else {
      // Crear nuevo menú
      // Generar nuevo id sumando 1 al último id de la lista
      let newId = 1;
      if (this.menus.length > 0) {
        const lastMenu = this.menus[this.menus.length - 1];
        newId = (lastMenu.idMenu || 0) + 1;
      }
      this.menuObject.idMenu = newId;
      // Clonar el objeto y enviar todas las propiedades requeridas por Menu
      const menuToSend: Menu = {
        ...this.menuObject,
        fechaCreacion: this.menuObject.fechaCreacion,
        fechaModificacion: this.menuObject.fechaModificacion
      };
      this.menuService.post<Menu>('menu/save', menuToSend).subscribe({
        next: (data) => {
          this.loadMenus();
          this.resetMenuForm();
        },
        error: (err) => {
          console.error('Error al crear menu', err);
        }
      });
    }
  }

  editMenu(menu: Menu) {
    this.menuObject = { ...menu };
    this.editMode = true;
    this.showFormMenu = true;
  }

  deleteMenu(menu: Menu) {
    this.menuService.delete<Menu>(`menu/delete/${menu.idMenu}`).subscribe({
      next: (data) => {
        this.loadMenus();
      },
      error: (err) => {
        console.error('Error al eliminar menu', err);
      }
    });
  }

  resetMenuForm() {
    this.menuObject = {
      idMenu: 0,
      nombre: '',
      descripcion: '',
      url: '',
      icono: '',
      estado: true,
      fechaCreacion: new Date(),
      fechaModificacion: new Date(),
      roles: []
    };
    this.editMode = false;
  }
}
