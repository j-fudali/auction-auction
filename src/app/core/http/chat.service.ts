import { catchError } from 'rxjs/operators';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { throwError, BehaviorSubject, Observable, of } from 'rxjs';
import { ErrorHandlerService } from '../util/error-handler.service';
import { AuthService } from '../auth/auth.service';
import { environment } from 'src/environments/environment';
import { Discussion } from 'src/app/shared/interfaces/discussion/discussion';
import { PaginatedResponse } from 'src/app/shared/interfaces/paginated-response';
import { Chat } from 'src/app/shared/interfaces/discussion/chat';



@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private baseUrl = environment.url;
  private http = inject(HttpClient)
  private errorHandler = inject(ErrorHandlerService)
  private authService = inject(AuthService)

  getDiscussion(id: number, page?: number): Observable<Chat>{
    const token = this.authService.getToken();
    const header = new HttpHeaders().set('Authorization', `JWT${token}`);
    let params = new HttpParams()
    if(page) params = params.set('page', page);
    return this.http.get<Chat>(this.baseUrl + '/discussions/' + id, {headers: header})
    .pipe(
      catchError((err: HttpErrorResponse) => {
        if(err.status === 400){
          this.errorHandler.showError(err.error.message)
        }
        if(err.status === 422){
          this.errorHandler.showError(err.error.details || err.error.message)
        }
        return of({} as Chat)
      })
      );
  }
}
