import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Item } from 'src/app/shared/interfaces/item/item';
import { MyItemsFilters } from 'src/app/shared/interfaces/item/items-filters';
import { LoginAttempt } from 'src/app/shared/interfaces/login-attempt';
import { PaginatedResponse } from 'src/app/shared/interfaces/paginated-response';
import { NewUser } from 'src/app/shared/interfaces/user/new-user';
import { UpdateCredentials } from 'src/app/shared/interfaces/user/update-credentials';
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

  getUserCredentials(): Observable<User | null>{
    const token = this.authService.getToken();
    const header = new HttpHeaders().set('Authorization', `JWT ${token}`);
    return this.http.get<User>(this.baseUrl + '/me', {headers: header})
      .pipe(catchError((err: HttpErrorResponse) => {
        if(err.status == 400){
          this.errorHandler.showError(err.message)
        }
        if(err.status == 422){
          this.errorHandler.showError(err.error.details)
        }
        return of(null)
      }))
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
        if(err.status == 400){
          this.errorHandler.showError(err.error.details || err.error.message)
        }
        if(err.status == 422){
          this.errorHandler.showError(err.error.details || err.error.message)
        }
        return of(null)
      })
    )
  }
  activateUser(token: string){
    return this.http.post(this.baseUrl + '/activate', {token: token}).pipe(
      catchError( (err: HttpErrorResponse) => {
        if(err.status === 400){
          this.errorHandler.showError(err.error.details || err.error.message)
        }
        if(err.status == 422){
          this.errorHandler.showError(err.error.details || err.error.message)
        }
        return throwError(err)
      })
    )

  }
  resetPassword(email: string){
    return this.http.post(this.baseUrl + '/reset_password', {email}).pipe(
      catchError( (err: HttpErrorResponse ) => {
        if(err.status === 400){
          this.errorHandler.showError(err.error.details || err.error.message)
        }
        if(err.status == 422){
          this.errorHandler.showError(err.error.details || err.error.message)
        }
        return throwError(err)
      })
    )
  }
  resetPasswordConfirm(token: string, password: string){
    return this.http.post(this.baseUrl + '/reset_password/confirm', {token: token, password: password}).pipe(
      catchError( (err: HttpErrorResponse) => {
        if(err.status === 400){
          this.errorHandler.showError(err.error.details || err.error.message)
        }
        if(err.status == 422){
          this.errorHandler.showError(err.error.details || err.error.message)
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
          this.errorHandler.showError(err.error.details || err.error.message)
        }
        if(err.status == 422){
          this.errorHandler.showError(err.error.details || err.error.message)
        }
        return throwError(err)

      })
    )
  }
  editCredentials(credentials: UpdateCredentials){
    const token = this.authService.getToken();
    const header = new HttpHeaders().set('Authorization', `JWT${token}`);
    return this.http.patch(this.baseUrl + '/me', credentials, {headers: header}).pipe(
      catchError((err: HttpErrorResponse) => {
        if(err.status == 400){
          this.errorHandler.showError('Bad data provided')
        }
        if(err.status == 422){
          this.errorHandler.showError('Coutry or province are not existed')
        }
        return throwError(err)
      })
    )
  }

  getMyProducts(itemsFilters?: MyItemsFilters): Observable<PaginatedResponse<Item>>{
    const token = this.authService.getToken();
    const header = new HttpHeaders().set('Authorization', `JWT ${token}`);
    let params = new HttpParams()
    if(itemsFilters){
      if(itemsFilters.page) params = params.set("page", itemsFilters.page)
      if(itemsFilters.orderBy) params = params.set("order_by", itemsFilters.orderBy)
      if(itemsFilters.category) params = params.set("category", itemsFilters.category)
      if(itemsFilters.search) params = params.set("search", itemsFilters.search)
      if(itemsFilters.type) params = params.set("type", itemsFilters.type)
    }
    return this.http.get<PaginatedResponse<Item>>(this.baseUrl + '/me/items', {params: params, headers: header})
    .pipe(
      catchError((err: HttpErrorResponse) => {
        if(err.status === 422){
          this.errorHandler.showError('There is no such page of items');
        }
        return of({} as PaginatedResponse<Item>);
      })
    )
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
  loginAttempts(page?:number, orderBy?: string): Observable<PaginatedResponse<LoginAttempt>>{
    const token = this.authService.getToken();
    const header = new HttpHeaders().set('Authorization', `JWT${token}`);
    let params: HttpParams = new HttpParams();
    if(page) params = params.set('page', page);
    if(orderBy) params = params.append('order_by', orderBy)
    return this.http.get<PaginatedResponse<LoginAttempt>>(this.baseUrl + '/me/login_attempts', {headers: header, params: params})
    .pipe(
      catchError((err: HttpErrorResponse) => {
        if(err.status === 422){
          this.errorHandler.showError('There is no such page of items');
        }
        return of({} as PaginatedResponse<LoginAttempt>);
      })
    )
  }
  checkGeneratedReport(): Observable<{is_completed: 1 | 0, created_at: string}>{
    const token = this.authService.getToken();
    const header = new HttpHeaders().set('Authorization', `JWT ${token}`);
    return this.http.get<{is_completed: 1, created_at: string}>(this.baseUrl + '/me/auctions_report', {headers: header})

  }
  generateReport(): Observable<{message: string}>{
    const token = this.authService.getToken();
    const header = new HttpHeaders().set('Authorization', `JWT${token}`);
    return this.http.post<{message: string}>(this.baseUrl + '/me/auctions_report', {headers: header})
  }
  refreshAccessToken(refreshToken: string): Observable<{token: string; refresh_token: string}>{
    return this.http.post<{token: string; refresh_token: string}>(this.baseUrl + '/refreshtoken', {token: refreshToken});
  }
}
