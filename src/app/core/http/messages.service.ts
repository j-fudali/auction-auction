import { ErrorHandlerService } from './error-handler.service';
import { catchError } from 'rxjs/operators';
import { AuthService } from './auth/auth.service';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MessagesService {
  private baseUrl = environment.url;
  messagePosition: BehaviorSubject<string> = new BehaviorSubject<string>('');
  constructor(private http: HttpClient, private _authService: AuthService, private _errorHandler: ErrorHandlerService) { }

  createNewMessage(idDiscussion: number, content: string): Observable<any>{
    const token = this._authService.getToken();
    const header = new HttpHeaders().set('Authorization', `JWT${token}`);
    return this.http.post(this.baseUrl + '/messages', {id_discussion: idDiscussion, content: content}, {headers: header}).pipe(catchError(this.handleError.bind(this)));
  }

  addImagesToMessage(idMessage: number, image: File){
    const token = this._authService.getToken();
    const header = new HttpHeaders().set('Authorization', `JWT${token}`);
    const formdata = new FormData();
    formdata.append('id_message', idMessage.toString())
    formdata.append('image', image);
    return this.http.post(this.baseUrl + '/messagesImages', formdata, {headers: header}).pipe(catchError(this.handleError.bind(this)))
  }

  private handleError(error: HttpErrorResponse){
    let errorMessage = 'Nieznany błąd';
    const errorStatus = error.status;
    switch(errorStatus){
      case 400:
        errorMessage = 'Coś poszło nie tak. Spróbuj ponownie'
        break
      case 404:
        errorMessage = 'Nie znaleziono przedmiotu'
        break
      case 405:
        errorMessage = 'Błąd serwera. Spróbuj ponownie'
        break
      case 422:
        errorMessage = 'Wystąpił błąd. Spróbuj ponownie'
        break
      default:
        errorMessage= 'Usługa nie działa. Spróbuj później'

    }
    this._errorHandler.handleError(errorMessage);

    return throwError(errorMessage);
  }
}
