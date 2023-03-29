import { catchError } from 'rxjs/operators';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { throwError, Observable } from 'rxjs';
import { ErrorHandlerService } from '../util/error-handler.service';
import { AuthService } from '../auth/auth.service';
import { Notification } from 'src/app/shared/interfaces/notification';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {
  private baseUrl: string = environment.url + '/users/me/notifications'
  private http = inject(HttpClient)
  private errorHandler =  inject(ErrorHandlerService)
  private authService = inject(AuthService)

  getAllUserNotifications(): Observable<Notification[]>{
    const token = this.authService.getToken();
    const header = new HttpHeaders().set('Authorization', `JWT${token}`)
    return this.http.get<Notification[]>(this.baseUrl, {headers: header})
  }

  deleteNotification(idNotification: number){
    const token = this.authService.getToken();
    const header = new HttpHeaders().set('Authorization', `JWT ${token}`);
    return this.http.post(this.baseUrl, {id_notification: idNotification}, {headers: header})
  }
 
}
