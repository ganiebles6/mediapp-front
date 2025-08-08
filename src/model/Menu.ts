import { Rol } from "app/rol/rol";

export interface Menu {
  idMenu: number;
  nombre: string;
  descripcion: string;
  icono: string;
  fechaCreacion: Date;
  fechaModificacion: Date;
  url: string;
  estado: boolean;
  roles: Rol[]
}