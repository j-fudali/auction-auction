import { Component, inject, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { BreakpointObserver, Breakpoints } from "@angular/cdk/layout";
import { ReactiveFormsModule, FormBuilder, Validators } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatDividerModule } from "@angular/material/divider";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatSnackBar } from "@angular/material/snack-bar";
import { RouterModule, ActivatedRoute } from "@angular/router";
import { catchError, map, switchMap, tap } from "rxjs/operators";
import { UserService } from "src/app/core/http/user.service";
import { User } from "src/app/shared/interfaces/user/user";
import { HttpErrorResponse } from "@angular/common/http";
import { of, throwError } from "rxjs";
import { DateTime } from "luxon";

@Component({
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatDividerModule,
    MatCardModule,
    MatInputModule,
    MatDatepickerModule,
    MatSelectModule,
    RouterModule,
  ],
  templateUrl: "./profile-page.component.html",
  styleUrls: ["./profile-page.component.scss"],
})
export class ProfilePageComponent implements OnInit {
  private userService = inject(UserService);
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private breakpoints = inject(BreakpointObserver);
  private snackbar = inject(MatSnackBar);
  isLtMd$ = this.breakpoints
    .observe([Breakpoints.XSmall, Breakpoints.Small])
    .pipe(map((v) => v.matches));
  userData = this.route.snapshot.data.profileData[0] as User;
  provinces = this.route.snapshot.data.profileData[1] as {
    id_province: number;
    name: string;
  }[];
  countries = this.route.snapshot.data.profileData[2] as {
    id_country: number;
    name: string;
  }[];

  profileForm = this.fb.nonNullable.group({
    phone: [
      this.userData.phone,
      [Validators.required, Validators.minLength(9), Validators.maxLength(12)],
    ],
    country: [
      this.countries.find((c) => c.name == this.userData.country)?.id_country,
      Validators.required,
    ],
    province: [
      this.provinces.find((p) => p.name == this.userData.province)?.id_province,
      Validators.required,
    ],
    postcode: [this.userData.postcode, Validators.required],
    city: [this.userData.city, Validators.required],
    street: [this.userData.street, Validators.required],
  });

  ngOnInit(): void {
    this.profileForm.disable();
  }
  get phone() {
    return this.profileForm.get("phone");
  }
  get country() {
    return this.profileForm.get("country");
  }
  get province() {
    return this.profileForm.get("province");
  }
  get postcode() {
    return this.profileForm.get("postcode");
  }
  get city() {
    return this.profileForm.get("city");
  }
  get street() {
    return this.profileForm.get("street");
  }
  cancel() {
    this.profileForm.disable();
  }
  toggleUpdate() {
    this.profileForm.enable();
  }
  generateReport() {
    this.userService
      .checkGeneratedReport()
      .pipe(
        catchError((err: HttpErrorResponse) => {
          if (err.status == 404) {
            this.snackbar.open(
              "We start to generate your report. Check out your email few minutes later.",
              "X",
              { duration: 5000 }
            );
          }
          console.log('Błąd')
          return of(null);
        }),
        switchMap((res) => {
          if (res == null) {
            return this.userService.generateReport();
          }
          if (res != null)
            this.snackbar.open(
              `Your report ${
                res.is_completed === 0
                  ? "is not completed"
                  : "is completed. You can now download it from your email"
              }. You started it at ` + DateTime.fromFormat(res.created_at,'yyyy-MM-dd hh:mm:ss', {zone: 'utc'}).toLocal().toFormat('dd.MM.yyyy HH:mm:ss')
            , 'X');
          return of(null);
        })
      )
      .subscribe();
  }
  onSubmit() {
    if (this.profileForm.dirty && this.profileForm.valid) {
      const value = this.profileForm.value;
      this.userService
        .editCredentials({
          phone: value.phone,
          id_country: value.country,
          id_province: value.province,
          postcode: value.postcode,
          city: value.city,
          street: value.street,
        })
        .subscribe({
          next: () => {
            this.snackbar.open("Your date has been updated!", "OK!", {
              duration: 5000,
            });
            this.profileForm.disable();
          },
        });
    }
  }
}
