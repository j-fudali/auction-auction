import { ActivatedRoute, Router } from "@angular/router";
import {
  Validators,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
} from "@angular/forms";
import { Component, OnInit, inject } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { UserService } from "src/app/core/http/user.service";
import { CommonModule } from "@angular/common";
import { MatFormFieldModule } from "@angular/material/form-field";
import { validatePassword } from "src/app/shared/validators/confirm-password.validator";
import { MatInputModule } from "@angular/material/input";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MatTooltipModule } from "@angular/material/tooltip";

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatIconModule, MatButtonModule, MatTooltipModule],
  template: `<form [formGroup]="passwordResetForm" (ngSubmit)="onSubmit()" >
  <h2>Confirm reset password</h2>
  <mat-form-field>
    <mat-label>Password</mat-label>
    <input matInput type="password" formControlName="password">
    <mat-error *ngIf="password?.hasError('required')"><small>Required field</small></mat-error>
    <mat-error class="pattern-error" *ngIf="password?.hasError('pattern')"><small>Password format invalid</small><mat-icon matTooltip="It has to contain 1 small, 1 big letter, 1 digit, 1 special character, min. 8 and max. 25 characters">info</mat-icon></mat-error>
  </mat-form-field>
  
  <mat-form-field>
    <mat-label>Repeat password</mat-label>
    <input  matInput type="password" formControlName="rePassword">
    <mat-error *ngIf="rePassword?.hasError('required')"><small>Required field</small></mat-error>
    <mat-error *ngIf="rePassword?.hasError('passwordsNotMatch')"><small>Passwords are not the same</small></mat-error>
  </mat-form-field>
  <button type="submit" mat-stroked-button>Send</button>
</form>
`,
  styles: [
    `:host{
      width: 60%;
    }`,
    `form{
      display: flex;
      flex-direction: column;
      gap: 5px;

    }
    `,
    `h2{
      align-self: center;
    }`
  ],
})
export class ResetPasswordConfirmComponent implements OnInit {
  private token: string;
  private snackback: MatSnackBar = inject(MatSnackBar);
  private router: Router = inject(Router);
  private _route: ActivatedRoute = inject(ActivatedRoute);
  private fb: FormBuilder = inject(FormBuilder);
  private _userService: UserService = inject(UserService);
  passwordResetForm: FormGroup;

  ngOnInit(): void {
    this.token = this._route.snapshot.paramMap.get("token")!;
    this.passwordResetForm = this.fb.nonNullable.group(
      {
        password: [
          "",
          [
            Validators.required,
            Validators.required,
            Validators.pattern(
              "(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~]).{8,25}"
            ),
          ],
        ],
        rePassword: ["", Validators.required],
      },
      { validators: validatePassword() }
    );
  }
  get password() {
    return this.passwordResetForm.get("password");
  }
  get rePassword() {
    return this.passwordResetForm.get("rePassword");
  }

  onSubmit() {
    this._userService
      .resetPasswordConfirm(this.token, this.password?.value)
      .subscribe(() => {
        this.snackback.open("You reset your password", "X");
        this.router.navigate(["/home"]);
      });
  }
}
