import { Injectable } from '@angular/core';
import { ApiService } from 'services/services-api';
import { Menu } from 'models/menu.model';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MenuService extends ApiService {
  getAll(): Observable<Menu[]> {
    return this.get<Menu[]>("menu/getAll");
  }

  save(menu: Menu): Observable<Menu> {
    return this.post<Menu>('menu/save', menu);
  }

  update(menu: Menu): Observable<Menu> {
    return this.put<Menu>(`menu/modify/${menu.idMenu}`, menu);
  }

  deleteMenu(idMenu: number): Observable<Menu> {
    return super.delete(`menu/delete/${idMenu}`);
  }
}
