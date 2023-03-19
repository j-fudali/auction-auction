import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute } from '@angular/router';
import { User } from 'src/app/shared/interfaces/user/user';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { DateTime } from 'luxon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';
import { UserService } from 'src/app/core/http/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';

@Component({
  standalone: true,
  imports: [CommonModule, MatButtonModule,
     ReactiveFormsModule, MatFormFieldModule,
     MatDividerModule, MatCardModule,  MatInputModule, MatDatepickerModule, MatSelectModule],
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.scss']
})
export class MyProfileComponent implements OnInit{
  private userService = inject(UserService)
  private fb = inject(FormBuilder)
  private route = inject(ActivatedRoute)
  private breakpoints = inject(BreakpointObserver)
  private snackbar = inject(MatSnackBar)
  isLtMd$ = this.breakpoints.observe([Breakpoints.XSmall, Breakpoints.Small]).pipe(map( v => v.matches))
  userData = this.route.snapshot.data.profileData[0] as User
  provinces = this.route.snapshot.data.profileData[1] as {id_province: number, name: string}[]
  countries = this.route.snapshot.data.profileData[2] as {id_country: number, name: string}[]
  profileForm = this.fb.nonNullable.group({
    phone: [this.userData.phone, Validators.required],
    birthDate: [DateTime.fromFormat('yyy-MM-dd',this.userData.birth_date)],
    country: [this.countries.find(c => c.name == this.userData.country)?.id_country, Validators.required],
    province: [this.provinces.find(p => p.name == this.userData.province)?.id_province, Validators.required],
    postcode: [this.userData.postcode, Validators.required],
    city: [this.userData.city, Validators.required],
    street: [this.userData.street, Validators.required],
  }
  )

  ngOnInit(): void{
    this.profileForm.disable()
  }
  get phone(){
    return this.profileForm.get('phone')
  }
  get country(){
    return this.profileForm.get('country')
  }
  get province(){
    return this.profileForm.get('province')
  }
  get postcode(){
    return this.profileForm.get('postcode')
  }
  get city(){
    return this.profileForm.get('city')
  }
  get street(){
    return this.profileForm.get('street')
  }
  cancel(){
    this.profileForm.disable()
  }
  toggleUpdate(){
    this.profileForm.enable()
  }

  onSubmit(){
    console.log(this.profileForm)
    if(this.profileForm.dirty && this.profileForm.valid){
      const value = this.profileForm.value
      this.userService.editCredentials({
        phone: value.phone,
        id_country: value.country,
        id_province: value.province,
        postcode: value.postcode,
        city: value.city,
        street: value.street
      })
      .subscribe({
        next: () => {
          this.snackbar.open('Your date has been updated!', 'OK!', {duration: 5000})
          this.profileForm.disable()
        }
      })
    }
  }
}
