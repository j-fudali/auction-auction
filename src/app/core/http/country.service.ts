import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { throwError, Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ErrorHandlerService } from '../util/error-handler.service';

@Injectable({
  providedIn: 'root'
})
export class CountryService {
  private baseUrl: string = environment.url + '/countries'
  private http = inject(HttpClient)
  private errorHandle = inject(ErrorHandlerService);

  getCoutries(): Observable<any>{
    return this.http.get(this.baseUrl).pipe(
      catchError((err: HttpErrorResponse) => {
        if(err.status === 400){
          this.errorHandle.showError(err.error.message)
        }
        if(err.status === 422){
          this.errorHandle.showError(err.error.details || err.error.message)
        }
        return of([])
      })
    )
  }
}
