import { FormControl, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { Component, inject } from "@angular/core";
import { UserService } from "src/app/core/http/user.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { CommonModule } from "@angular/common";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";

@Component({
  standalone: true,
  imports: [CommonModule, MatFormFieldModule, MatInputModule, MatButtonModule, ReactiveFormsModule],
  template: `<div>
    <h2>Reset password</h2>
    <mat-form-field>
      <mat-label>E-mail</mat-label>
      <input type="email" matInput [formControl]="email">
      <mat-error *ngIf="email?.hasError('required')"><small>Required field</small></mat-error>
      <mat-error *ngIf="email?.hasError('email')"><small>Invalid e-mail format</small></mat-error>
    </mat-form-field>
    <button (click)="onSubmit()" [disabled]="email.invalid" mat-stroked-button>Send</button>
  </div> `,
  styles: [
    `:host{
      width: 60%;
    }`,
    `div{
      display: flex;
      flex-direction: column;
      gap: 5px;
    }
    `,
    `h2{
      align-self: center;
    }
    `
  ],
})
export class ResetPasswordComponent {
  email = new FormControl("", [Validators.required, Validators.email]);
  private snackbar: MatSnackBar = inject(MatSnackBar);
  private _userService: UserService = inject(UserService);

  onSubmit() {
    this._userService.resetPassword(this.email.value!).subscribe(() => {
      this.snackbar.open("We send you a reset link on your e-mail", "X");
    });
  }
}
