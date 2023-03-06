import { ResetPasswordConfirmComponent } from './pages/reset-password-confirm/reset-password-confirm.component';
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component';
import { HomeComponent } from './home.component';
import { Route } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { SignupComponent } from './pages/signup/signup.component';

export default [
  {path: '', component: HomeComponent, children: [
    {path: 'login', component: LoginComponent},
    {path: 'sign-up', component: SignupComponent},
    {path: 'reset-password', component: ResetPasswordComponent},
    {path: 'reset-password-confirm/:token', component: ResetPasswordConfirmComponent},
    {path: '', redirectTo: 'login', pathMatch: 'full'}
  ]},
] as Route[];