import { Routes } from '@angular/router';

export const routes: Routes = [
  {path: 'home', loadChildren: () => import('./home/home-routing')},
  {path: 'dashboard', loadChildren: () => import('./dashboard/dashboard-routing')},
  {path: 'activate/:token', loadComponent: () => import('./activate/activate.component').then(c => c.ActivateComponent)},
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  {path: '**', redirectTo: '/home'}
];

