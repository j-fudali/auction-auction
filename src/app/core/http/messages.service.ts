import { catchError } from 'rxjs/operators';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { ErrorHandlerService } from '../util/error-handler.service';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class MessagesService {
  private baseUrl = environment.url;
  private http = inject(HttpClient)
  private authService = inject(AuthService)
  private _errorHandler = inject(ErrorHandlerService)

  createNewMessage(idDiscussion: number, content: string){
    const token = this.authService.getToken()
    const header = new HttpHeaders().set('Authorization', `JWT ${token}`);
    return this.http.post<{message: string, id_message: number}>(this.baseUrl + '/messages', {id_discussion: idDiscussion, content: content}, {headers: header})
    .pipe(
      catchError((err:HttpErrorResponse) => {
        if(err.status === 400){
          this._errorHandler.showError(err.error.message)
        }
        if(err.status === 422){
          this._errorHandler.showError(err.error.details || err.error.message)
        }
        return of({} as {message: string, id_message: number})
      })
    );
  }

  addImagesToMessage(idMessage: number, image: File){
    const token = this.authService.getToken();
    const header = new HttpHeaders().set('Authorization', `JWT${token}`);
    const formdata = new FormData();
    formdata.append('id_message', idMessage.toString())
    formdata.append('image', image);
    return this.http.post(this.baseUrl + '/messagesImages', formdata, {headers: header})
    .pipe(catchError((err:HttpErrorResponse) => {
      if(err.status === 400){
        this._errorHandler.showError(err.error.message)
      }
      if(err.status === 422){
        this._errorHandler.showError(err.error.details || err.error.message)
      }
      return of(null)
    }))
  }
}
