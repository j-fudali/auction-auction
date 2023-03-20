import { catchError, tap } from 'rxjs/operators';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth/auth.service';
import { ErrorHandlerService } from '../util/error-handler.service';
import { Discussion } from 'src/app/shared/interfaces/discussion/discussion';

@Injectable({
  providedIn: 'root'
})
export class DiscussionsService {
  private baseUrl: string = environment.url;
  private http: HttpClient = inject(HttpClient)
  private authService: AuthService = inject(AuthService)
  private errorHandler: ErrorHandlerService = inject(ErrorHandlerService)
  isNewDiscussion = new BehaviorSubject<boolean>(false);

  getAllDiscussions(page?: number): Observable<Discussion[]>{
    const token = this.authService.getToken();
    const header = new HttpHeaders().set('Authorization', `JWT${token}`);
    let params = new HttpParams();
    if(page) params = params.set('page', page)
    return this.http.get<Discussion[]>(this.baseUrl + '/users/me/discussions', {headers: header, params: params})
    .pipe(
      catchError((err: HttpErrorResponse) => {
        if(err.status === 400){
          this.errorHandler.showError(err.error.message)
        }
        if(err.status === 422){
          this.errorHandler.showError(err.error.details || err.error.message)
        }
        return of([])
      })
    )
  }
  // createNewDiscussion(idItem: number, content: string){
  //   const token = this._authService.getToken();
  //   const header = new HttpHeaders().set('Authorization', `JWT${token}`);
  //   return this.http.post(this.baseUrl + '/discussions', {id_item: idItem, content: content}, { headers: header}).pipe(catchError(this.handleError.bind(this)))
  // }
}
