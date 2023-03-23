import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';
import { UserService } from 'src/app/core/http/user.service';
import { AuthService } from 'src/app/core/auth/auth.service';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, MatTooltipModule],
  template: `
    <form [style.padding]="(isLtMd$ | async) ? '10px 50px' : '10px 350px'" [formGroup]="newPasswordForm" (ngSubmit)="onSubmit()">
      <h2>Change password</h2>
      <mat-form-field>
        <mat-label>Old password</mat-label>
        <input type="password" matInput formControlName="oldPassword">
        <mat-error *ngIf="newPasswordForm.get('oldPassword')?.hasError('required')"><small>Required field</small></mat-error>
      </mat-form-field>
      <mat-form-field>
        <mat-label>New password</mat-label>
        <input type="password" matInput formControlName="newPassword">
        <mat-error *ngIf="newPasswordForm.get('newPassword')?.hasError('required')"><small>Required field</small></mat-error>
        <mat-error class="pattern-error" *ngIf="newPasswordForm.get('newPassword')?.hasError('pattern')"><small>Password format invalid</small><mat-icon matTooltip="It has to contain 1 small, 1 big letter, 1 digit, 1 special character, min. 8 and max. 25 characters">info</mat-icon></mat-error>
      </mat-form-field>
      <button type="submit" mat-stroked-button>Submit</button>
    </form>
  `,
  styles: [
    `form{
      height: 100vh;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: stretch;
      gap: 5px;
      h2{
        text-align: center;
      }
    }`
  ]
})
export class PasswordChangeComponent {
  private breakpoints = inject(BreakpointObserver)
  private userService = inject(UserService)
  private authService = inject(AuthService)
  isLtMd$ = this.breakpoints.observe([Breakpoints.XSmall, Breakpoints.Small]).pipe(map( v => v.matches))
  newPasswordForm = new FormGroup({
    oldPassword: new FormControl('', Validators.required),
    newPassword: new FormControl('', [Validators.required,Validators.pattern(
      "(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~]).{8,25}"
    )])
  })
  onSubmit(){
    if(this.newPasswordForm.dirty && this.newPasswordForm.valid){
      this.userService.changePassword(this.newPasswordForm.get('oldPassword')?.value!, this.newPasswordForm.get('newPassword')?.value!)
      .subscribe(() => this.authService.logout())
    }
  }
}
