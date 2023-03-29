import { ResetPasswordConfirmComponent } from './pages/reset-password-confirm/reset-password-confirm.component';
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component';
import { HomeComponent } from './home.component';
import { Route, Router } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { SignupComponent } from './pages/signup/signup.component';
import { inject } from '@angular/core';
import { AuthService } from '../core/auth/auth.service';

const isAlreadyLoggedIn = () => {
  const authService = inject(AuthService)
  const router = inject(Router)
  return authService.isAuthenticated() ? router.navigate(['/dashboard/products']) : true;
}

export default [
  {path: '', component: HomeComponent, canActivate: [isAlreadyLoggedIn], children: [
    {path: 'login', component: LoginComponent},
    {path: 'sign-up', component: SignupComponent},
    {path: 'reset-password', component: ResetPasswordComponent},
    {path: 'reset-password-confirm/:token', component: ResetPasswordConfirmComponent},
    {path: '', redirectTo: 'login', pathMatch: 'full'}
  ]},
] as Route[];