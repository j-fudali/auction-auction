import { inject } from '@angular/core';
import { Router, Routes } from '@angular/router';
import { AuthService } from './core/auth/auth.service';

const dashboardGuard = () => {
  const isAuth = inject(AuthService).isAuthenticated()
  const router = inject(Router)
  return !isAuth ? router.navigate(['/home/login']) : true;
}

export const routes: Routes = [
  {path: 'home', loadChildren: () => import('./home/home-routing')},
  {path: 'dashboard', loadChildren: () => import('./dashboard/dashboard-routing'), canMatch: [dashboardGuard]},
  {path: 'activate/:token', loadComponent: () => import('./activate/activate.component').then(c => c.ActivateComponent)},
  { path: '', redirectTo: '/home/login', pathMatch: 'full' },
  {path: '**', redirectTo: '/home/login'}
];

