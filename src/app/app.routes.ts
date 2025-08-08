import { Routes } from '@angular/router';
import { Configuration } from './configuration/configuration';
import { MenuComponent } from './menu/menu';
import { Rol } from './rol/rol';

export const routes: Routes = [
  {
    path: 'configuration',
    component: Configuration,
    children: [
      { path: 'menu', component: MenuComponent },
      { path: 'rol', component: Rol },
      { path: '', redirectTo: '', pathMatch: 'full' } // ruta por defecto
    ]
  },
  {
    path: '',
    // If this path is the 'full' match...
    pathMatch: 'full',
    // ...redirect to this route.
    redirectTo:'',
  }
];
