import { Router, RouterModule } from "@angular/router";
import { Component, OnInit, inject } from "@angular/core";
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { UserService } from "src/app/core/http/user.service";
import { CommonModule } from "@angular/common";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { AuthService } from "src/app/core/auth/auth.service";
import { HttpErrorResponse } from "@angular/common/http";

@Component({
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatButtonModule,
  ],
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit {
  private _userService: UserService = inject(UserService);
  private fb: FormBuilder = inject(FormBuilder);
  private _router: Router = inject(Router);
  private authService: AuthService = inject(AuthService);
  loginForm: FormGroup;
  attemptsNumber: number = 5;
  waitToLoginTime: number = 30;
  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", Validators.required],
    });
  }

  get email(): AbstractControl | null {
    return this.loginForm.get("email");
  }
  get password(): AbstractControl | null {
    return this.loginForm.get("password");
  }
  wait() {
    this.waitToLoginTime = 30;
    const timout = setInterval(() => {
      if (this.waitToLoginTime == 0) {
        this.attemptsNumber = 5;
        clearInterval(timout);
      }
      this.waitToLoginTime--;
    }, 1000);
  }
  onSubmit(): void {
    this._userService.login(this.email?.value, this.password?.value).subscribe(
      (res) => {
        if (res) {
          this.authService.setToken(res.token);
          this.authService.setRefreshToken(res.refresh_token);
          this._router.navigate(["/dashboard"]);
        }
      },
      (err: HttpErrorResponse) => {
        if (
          (err.status === 400 || err.status === 422) &&
          this.attemptsNumber > 0
        )
          this.attemptsNumber--;
        if (this.attemptsNumber == 0) {
          this.wait();
          return;
        }
      }
    );
  }
}
