import { Rol } from 'models/rol.model';
import { ViewChild, TemplateRef, AfterViewInit, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Menu } from 'models/menu.model';
import { MenuService } from './menu.service';
import { ConfirmDialogComponent } from '../shared/confirm-dialog.component';
import { TableComponent } from '../shared/table.component';
import { GlobalFilterComponent } from '../shared/global-filter.component';
import { ToastComponent } from 'app/shared/toast.component';
import { RolService } from 'app/rol/rol.service';

@Component({
  selector: 'app-menu',
  imports: [CommonModule, FormsModule, ConfirmDialogComponent, TableComponent, ToastComponent, GlobalFilterComponent],
  standalone: true,
  templateUrl: './menu.html',
  styleUrl: './menu.css'
})
export class MenuComponent implements AfterViewInit {

  menusFiltrados: Menu[] = [];

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
  roles: Rol[] = [];
  constructor(private menuService: MenuService, private rolService: RolService) {}

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
    this.menusFiltrados = [...this.menus];
    this.rolService.loadRoles().subscribe(() => {
      this.roles = this.rolService.roles;
    });
  }

  openNewMenu() {
 
    this.resetMenuForm();
    this.showFormMenu = true;
  }

  onConfirmSave() {
    this.showConfirm = false;
    this.showFormMenu = false;
    this.saveMenu();
  }

  loadMenus(): void {
    this.menuService.getAll().subscribe({
      next: (data) => {
        this.menus = data;
        // No aplicar filtros automáticamente
        this.menusFiltrados = [...this.menus];
      },
      error: (err) => {
        console.error('Error al cargar los menús', err);
      }
    });
  }

  saveMenu() {
    // Limpiar los roles antes de enviar
    if (this.editMode) {
      this.menuService.update(this.menuObject).subscribe({
        next: (data) => {
          this.loadMenus();
          this.toastType = 'success';
          this.toastTitle = 'Éxito';
          this.toastMessage = 'Menú actualizado correctamente';
          this.toastVisible = true;
          this.resetMenuForm();
          // No aplicar filtros automáticamente
          this.menusFiltrados = [...this.menus];
        },
        error: (err) => {
          console.error('Error al actualizar menu', err);
        }
      });
    } else {
      // Crear nuevo menú
      let newId = 1;
      if (this.menus.length > 0) {
        const lastMenu = this.menus[this.menus.length - 1];
        newId = (lastMenu.idMenu || 0) + 1;
      }
      this.menuObject.idMenu = newId;
      const menuToSend: Menu = {
        ...this.menuObject,
        fechaCreacion: this.menuObject.fechaCreacion,
        fechaModificacion: this.menuObject.fechaModificacion
      };
      this.menuService.save(menuToSend).subscribe({
        next: (data) => {
          this.loadMenus();
          this.resetMenuForm();
          // No aplicar filtros automáticamente
          this.menusFiltrados = [...this.menus];
        },
        error: (err) => {
          console.error('Error al crear menu', err);
        }
      });
    }
  }

  editMenu(menu: Menu) {
    let selectedRoles: Rol[] = [];
    if (Array.isArray(menu.roles) && menu.roles.length > 0) {
      selectedRoles = menu.roles.map(rolMenu =>
        this.roles.find(r => r.idRol === rolMenu.idRol)
      ).filter(Boolean) as Rol[];
    }
    this.menuObject = { ...menu, roles: selectedRoles };
    this.editMode = true;
    this.showFormMenu = true;
  }

  deleteMenu(menu: Menu) {
    this.menuService.deleteMenu(menu.idMenu).subscribe({
      next: (data) => {
        this.loadMenus();
        // No aplicar filtros automáticamente
        this.menusFiltrados = [...this.menus];
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

    // Elimina un rol de los roles seleccionados
  removeRol(rol: Rol) {
    this.menuObject.roles = this.menuObject.roles.filter(r => r.idRol !== rol.idRol);
  }

  // Verifica si un rol ya está seleccionado
  isRolSelected(rol: Rol): boolean {
    return Array.isArray(this.menuObject?.roles) && this.menuObject.roles.some((r: Rol) => r.idRol === rol.idRol);
  }
  // Maneja el cambio de selección múltiple de roles
  onRolesChange(selected: Rol[]) {
    console.log('Selected roles:', selected);
    this.menuObject.roles = selected;
  }

  // Compara dos roles por idRol para el select múltiple
  compareRoles(r1: Rol, r2: Rol): boolean {
    return r1 && r2 ? r1.idRol === r2.idRol : r1 === r2;
  }

  aplicarFiltro(filtros: any) {
    this.menusFiltrados = this.menus.filter(menu => {
      // Filtrado por fecha
      const fechaValida = (!filtros.fechaInicio || new Date(menu.fechaCreacion) >= new Date(filtros.fechaInicio)) &&
                         (!filtros.fechaFin || new Date(menu.fechaCreacion) <= new Date(filtros.fechaFin));
      // Filtrado por estado
      const estadoValido = filtros.estado === 'todos' || (menu.estado ? 'activo' : 'inactivo') === filtros.estado;
      // Filtrado por texto
      const textoValido = !filtros.texto || menu.nombre.toLowerCase().includes(filtros.texto.toLowerCase());
      return fechaValida && estadoValido && textoValido;
    });
  }
}
