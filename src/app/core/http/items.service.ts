import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map } from 'rxjs/operators';
import { throwError, Observable, BehaviorSubject } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { ErrorHandlerService } from '../util/error-handler.service';
import { environment } from 'src/environments/environment';
import { Item } from 'src/app/shared/interfaces/item/item';
import { ItemsFilters } from 'src/app/shared/interfaces/item/items-filters';

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

  private itemCountSubject = new BehaviorSubject<number>(0);
  public itemsCount$ = this.itemCountSubject.asObservable()

  getItems(itemsFilters?: ItemsFilters): Observable<Item[]>{
    let params = new HttpParams()
    if(itemsFilters && itemsFilters.page) params = params.set("page", itemsFilters.page)
    if(itemsFilters && itemsFilters.orderBy) params = params.set("order_by", itemsFilters.orderBy)
    if(itemsFilters && itemsFilters.category) params = params.set("category", itemsFilters.category)
    if(itemsFilters && itemsFilters.search) params = params.set("search", itemsFilters.search)
    return this.http.get<{current_page: number, pages: number,items_count: number, result: Item[]}>(this.baseUrl, {params: params}).pipe(
      map( res => {
        this.itemCountSubject.next(res.items_count)
        return res.result
      }),
      catchError( (err: HttpErrorResponse) => {
        if(err.status === 400){
          this.errorHandler.showError(err.error.message)
        }
        if(err.status == 422){
          this.errorHandler.showError(err.error.details)
        }
        return throwError(err)
      })
    )
  }
  getRelatedItems(par: string, page?: number): Observable<any>{
    const token = this.authService.getToken();
    const header = new HttpHeaders().set('Authorization', `JWT${token}`);
    let param = new HttpParams().set('type', par);
    if(page){
      param = param.set('page', page);
    }
    return this.http.get(this.relatedMeItems, {headers: header, params: param})
  }
  getParticularItem(id: number): Observable<any> {
    return this.http.get(this.baseUrl + '/' + id);
  }

  createNewItem(name: string, descriptpion: string, category: number, startingPrice: string, endingTime: string): Observable<any>{
    const token = this.authService.getToken();
    const header = new HttpHeaders().set('Authorization', `JWT${token}`);
    return this.http.post(this.baseUrl, {
      name: name,
      description: descriptpion,
      id_category: category,
      starting_price: startingPrice,
      ending_time: endingTime
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

    return this.http.post(this.itemImagesUrl, formdata, {headers: header})
  }
}
