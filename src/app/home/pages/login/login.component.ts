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

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      usernameOrEmail: ["", Validators.required],
      password: ["", Validators.required],
    });
  }

  get usernameOrEmail(): AbstractControl | null {
    return this.loginForm.get("usernameOrEmail");
  }
  get password(): AbstractControl | null {
    return this.loginForm.get("password");
  }

  onSubmit(): void {
    this._userService.login(this.usernameOrEmail?.value, this.password?.value)
    .subscribe((res) => {
      if(res){
        this.authService.setToken(res.token);
        this.authService.setRefreshToken(res.refresh_token);
        this._router.navigate(["/dashboard"]);
      }
    });
  }
}
