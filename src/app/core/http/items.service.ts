import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, tap } from 'rxjs/operators';
import { throwError, Observable, of } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { ErrorHandlerService } from '../util/error-handler.service';
import { environment } from 'src/environments/environment';
import { Item } from 'src/app/shared/interfaces/item/item';
import { ItemsFilters } from 'src/app/shared/interfaces/item/items-filters';
import { PaginatedResponse } from 'src/app/shared/interfaces/paginated-response';
import { ParticularItem } from 'src/app/shared/interfaces/item/particular-item';
import { Router } from '@angular/router';
import { NewItem } from 'src/app/shared/interfaces/item/new-item';

@Injectable({
  providedIn: 'root'
})
export class ItemsService {
  private baseUrl = environment.url + '/items'
  private itemImagesUrl = environment.url + '/itemsImages'
  private relatedMeItems = environment.url + '/users/me/items'
  private errorHandler: ErrorHandlerService = inject(ErrorHandlerService) 
  private http = inject(HttpClient)
  private authService = inject(AuthService)
  private router = inject(Router)
  getItems(itemsFilters?: ItemsFilters): Observable<PaginatedResponse<Item>>{
    let params = new HttpParams()
    if(itemsFilters){
      if(itemsFilters.page) params = params.set("page", itemsFilters.page)
      if(itemsFilters.orderBy) params = params.set("order_by", itemsFilters.orderBy)
      if(itemsFilters.category) params = params.set("category", itemsFilters.category)
      if(itemsFilters.search) params = params.set("search", itemsFilters.search)
    }
    return this.http.get<PaginatedResponse<Item>>(this.baseUrl, {params: params}).pipe(
      catchError( (err: HttpErrorResponse) => {
        if(err.status === 400){
          this.errorHandler.showError(err.error.message)
        }
        if(err.status == 422){
          this.errorHandler.showError(err.error.details)
        }
        return throwError(err)
      }))
  }
  getItemById(id: number): Observable<ParticularItem> {
    return this.http.get<ParticularItem>(this.baseUrl + '/' + id).pipe(
      catchError( (err: HttpErrorResponse) => {
        if(err.status === 400 || err.status === 404){
          this.errorHandler.showError(err.error.message)
        }
        if(err.status === 404){
          this.router.navigate(['/dashboard/products'])
        }
        if(err.status == 422){
          this.errorHandler.showError(err.error.details)
        }
        return throwError(err);
      })
    );
  }
  createNewItem(newItem: NewItem){
    const token = this.authService.getToken();
    const header = new HttpHeaders().set('Authorization', `JWT${token}`);
    return this.http.post<{message: string, id_item: number}>(this.baseUrl, 
      {name: newItem.name, description: newItem.description, id_category: newItem.category, starting_price: newItem.startingPrice,
        ending_time: newItem.endingTime
      }, 
      {headers: header})
  }
  addImagesToItem(idItem: number, image: File, isMain: string){
    const token = this.authService.getToken();
    const header = new HttpHeaders().set('Authorization', `JWT${token}`);
    const formdata = new FormData;
    formdata.append('id_item', `${idItem}`);
    formdata.append('is_main', `${isMain}`);
    formdata.append('image', image);
    console.log(formdata)
    return this.http.post<{message: string}>(this.itemImagesUrl, formdata, {headers: header})
  }
}
