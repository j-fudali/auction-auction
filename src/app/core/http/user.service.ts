import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { NewUser } from 'src/app/shared/interfaces/user/new-user';
import { User } from 'src/app/shared/interfaces/user/user';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth/auth.service';
import { ErrorHandlerService } from '../util/error-handler.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = environment.url + '/users';
  private http: HttpClient = inject(HttpClient)
  private errorHandler: ErrorHandlerService = inject(ErrorHandlerService) 
  private authService: AuthService = inject(AuthService)

  getUserCredentials(){
    const token = this.authService.getToken();
    const header = new HttpHeaders().set('Authorization', `JWT${token}`);
    return this.http.get(this.baseUrl + '/me', {headers: header})
      // .pipe(catchError((err) => this.handleError(err)))
  }
  getUserById(id: number): Observable<User>{
    const token = this.authService.getToken();
    const header = new HttpHeaders().set('Authorization', `JWT${token}`);
    return this.http.get<User>(this.baseUrl + '/' + id, {headers: header});
  }
  createUser(newUser: NewUser): Observable<{message: string} | null>{
    return this.http.post<{message: string}>(this.baseUrl + '/register', newUser)
    .pipe(
      catchError((err: HttpErrorResponse) => {
        if(err.status === 400){
          this.errorHandler.showError(err.error.message)
        }
        if(err.status == 422){
          this.errorHandler.showError(err.error.details)
        }
        return of(null)
      })
    )
  }
  activateUser(token: string){
    return this.http.post(this.baseUrl + '/activate', {token: token}).pipe(
      catchError( (err: HttpErrorResponse) => {
        if(err.status === 400){
          this.errorHandler.showError(err.error.message)
        }
        if(err.status == 422){
          this.errorHandler.showError(err.error.details)
        }
        return throwError(err)
      })
    )

  }
  resetPassword(email: string){
    return this.http.post(this.baseUrl + '/reset_password', {email}).pipe(
      catchError( (err: HttpErrorResponse ) => {
        if(err.status === 400){
          this.errorHandler.showError(err.error.message)
        }
        if(err.status == 422){
          this.errorHandler.showError(err.error.details)
        }
        return throwError(err)
      })
    )
  }
  resetPasswordConfirm(token: string, password: string){
    return this.http.post(this.baseUrl + '/reset_password/confirm', {token: token, password: password}).pipe(
      catchError( (err: HttpErrorResponse) => {
        if(err.status === 400){
          this.errorHandler.showError(err.error.message)
        }
        if(err.status == 422){
          this.errorHandler.showError(err.error.details)
        }
        return throwError(err)
      })
    )
  }
  login(usernameOrEmail: string, password: string){
    const loginData: {username?: string, email?: string, password: string} = { password }
    const regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (regex.test(usernameOrEmail)){
      loginData.email = usernameOrEmail
    }
    else{
      loginData.username = usernameOrEmail
    }
    return this.http.post<{token: string, refresh_token: string}>(this.baseUrl + '/login', loginData).pipe(
      catchError((err: HttpErrorResponse) => {
        if(err.status == 400){
          this.errorHandler.showError(err.error.message)
        }
        if(err.status == 422){
          this.errorHandler.showError(err.error.details)
        }
        return of(null)
      })
    )
  }
  editCredentials(cred: any){
    const token = this.authService.getToken();
    const header = new HttpHeaders().set('Authorization', `JWT${token}`);
    return this.http.patch(this.baseUrl + '/me', {
      phone: cred?.phone,
      id_country: cred?.id_country,
      id_province: cred?.id_province,
      postcode: cred?.postcode,
      city: cred?.city,
      street: cred?.street
    }, {headers: header}).pipe()
  }

  changePassword(oldPassword: string, newPassword: string){
    const token = this.authService.getToken();
    const header = new HttpHeaders().set('Authorization', `JWT${token}`);
    return this.http.post(this.baseUrl + '/me/change_password', {
      old_password: oldPassword,
      new_password: newPassword
    },
    {
      headers: header
    });
  }
  loginAttempts(page?:number, orderBy?: string): Observable<any>{
    const token = this.authService.getToken();
    const header = new HttpHeaders().set('Authorization', `JWT${token}`);
    let params: HttpParams = new HttpParams();
    if(page){
      params = params.set('page', page);
    }
    if(orderBy){
      params = params.append('order_by', orderBy)
    }
    if(params.has('page') || params.has('order_by')){
      return this.http.get(this.baseUrl + '/me/login_attempts', {headers: header, params: params});
    }
    return this.http.get(this.baseUrl + '/me/login_attempts', {headers: header});
  }

  
}
