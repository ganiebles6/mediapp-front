import { Injectable } from '@angular/core';
import { ApiService } from 'services/services-api';
import { Rol } from 'models/rol.model';
import { Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class RolService extends ApiService {

  save(rol: Rol): Observable<Rol> {
    return this.post<Rol>('rol/save', rol).pipe(
      tap((newRol) => {
        this.roles.push(newRol);
      }),
      catchError((err) => {
        console.error('Error al guardar rol', err);
        return of(null as any);
      })
    );
  }

  update(rol: Rol): Observable<Rol> {
    return this.put<Rol>(`rol/update/${rol.idRol}`, rol).pipe(
      tap((updatedRol) => {
        const idx = this.roles.findIndex(r => r.idRol === updatedRol.idRol);
        if (idx > -1) this.roles[idx] = updatedRol;
      }),
      catchError((err) => {
        console.error('Error al actualizar rol', err);
        return of(null as any);
      })
    );
  }

  deleteRolService(idRol: number): Observable<any> {
    return this.delete(`rol/delete/${idRol}`).pipe(
      tap(() => {
        this.roles = this.roles.filter(r => r.idRol !== idRol);
      }),
      catchError((err) => {
        console.error('Error al eliminar rol', err);
        return of(null);
      })
    );
  }
  public roles: Rol[] = [];

  loadRoles(): Observable<Rol[]> {
    return this.get<Rol[]>("rol/getAll").pipe(
      tap((roles) => { this.roles = roles; }),
      catchError((err) => {
        console.error('Error al cargar los roles', err);
        this.roles = [];
        return of([]);
      })
    );
  }
}
