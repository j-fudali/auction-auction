import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable, EventEmitter, inject } from '@angular/core';
import { catchError, tap } from 'rxjs/operators';
import { BehaviorSubject, Subject, throwError, Observable, ReplaySubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ErrorHandlerService } from '../util/error-handler.service';
import { AuthService } from '../auth/auth.service';
import { Favourite } from 'src/app/shared/interfaces/favourite';

@Injectable({
  providedIn: 'any'
})
export class FavouritesService {
  private baseUrl = environment.url;
  private http = inject(HttpClient)
  private authService = inject(AuthService)
  private errorHandler = inject(ErrorHandlerService)


  addToFavourites(idItem: number): Observable<{id_favourite: number, message: string}>{
    const token = this.authService.getToken();
    const header = new HttpHeaders().set('Authorization', `JWT${token}`);
    return this.http.post<{id_favourite: number, message: string}>(this.baseUrl + '/favourites', {id_item: idItem}, {headers: header})
    .pipe()
  }
  getFavourites(): Observable<Favourite[]>{
    const token = this.authService.getToken();
    const header = new HttpHeaders().set('Authorization', `JWT${token}`)
    return this.http.get<Favourite[]>(this.baseUrl + '/users/me/favourites', {headers: header});
  }
  deleteFavourite(idFav: number){
    const token = this.authService.getToken();
    const header = new HttpHeaders().set('Authorization', `JWT${token}`)
    return this.http.delete(this.baseUrl + '/favourites/' + idFav, {headers: header}).pipe()
  }
}
