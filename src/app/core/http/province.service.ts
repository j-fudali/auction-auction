import { catchError } from 'rxjs/operators';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { inject, Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { ErrorHandlerService } from '../util/error-handler.service';

@Injectable({
  providedIn: 'any'
})
export class ProvinceService {
  private http = inject(HttpClient)
  private errorHandle = inject(ErrorHandlerService)
  private baseUrl: string = environment.url + '/provinces'

  getProvinces(): Observable<{id_province: number, name: string}[]>{
    return this.http.get<{id_province: number, name: string}[]>(this.baseUrl).pipe(
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
