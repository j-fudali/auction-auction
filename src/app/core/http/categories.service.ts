import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ErrorHandlerService } from '../util/error-handler.service';
import { Category } from 'src/app/shared/interfaces/category/category';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {
  private http: HttpClient = inject(HttpClient)
  private errorHandler: ErrorHandlerService = inject(ErrorHandlerService)
  private baseUrl: string = environment.url + '/categories';

  getCategories(): Observable<Category[]>{
    return this.http.get<Category[]>(this.baseUrl)
    .pipe(
      catchError((err: HttpErrorResponse) => {
         if(err.status == 400){
          this.errorHandler.showError(err.error.message);
         }
         if(err.status == 422){
          this.errorHandler.showError(err.error.details)
         }
         return of([])
      })
    );
  }

}
