import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatTooltipModule } from "@angular/material/tooltip";
import { DateTime, Duration } from "luxon";
import { validatePassword } from "src/app/shared/validators/confirm-password.validator";
import { MatIconModule } from '@angular/material/icon';
@Component({
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatTooltipModule,
    MatIconModule
  ],
  templateUrl: "./signup.component.html",
  styleUrls: ["./signup.component.scss"],
})
export class SignupComponent {
  private fb: FormBuilder = inject(FormBuilder);

  today = DateTime.now().minus(Duration.fromObject({ day: 1 }));

  newUserForm = this.fb.nonNullable.group(
    {
      username: ["", [Validators.required, Validators.minLength(1), Validators.maxLength(30)]],
      firstName: ["",[ Validators.required, Validators.minLength(1), Validators.maxLength(30)]],
      lastName: ["", [Validators.required, Validators.minLength(1), Validators.maxLength(30)]],
      email: ["", [Validators.required, Validators.email]],
      birthDate: ["", Validators.required],
      password: [
        "",
        [
          Validators.required,
          Validators.pattern(
            "(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~]).{8,25}"
          ),
        ],
      ],
      rePassword: ["", Validators.required],
    },
    { validators: validatePassword()}
  );

  get username() {
    return this.newUserForm.get("username");
  }
  get firstName() {
    return this.newUserForm.get("firstName");
  }
  get lastName() {
    return this.newUserForm.get("lastName");
  }
  get email() {
    return this.newUserForm.get("email");
  }
  get birthDate() {
    return this.newUserForm.get("birthDate");
  }
  get password() {
    return this.newUserForm.get("password");
  }
  get rePassword() {
    return this.newUserForm.get("rePassword");
  }

  onSubmit() {
    // this._userService.createUser(user).subscribe()
  }
}
