import { inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { FavouritesService } from 'src/app/core/http/favourites.service';
import { Favourite } from 'src/app/shared/interfaces/favourite';

@Injectable({
  providedIn: 'root'
})
export class FavoritesStore {
  private favoritesService = inject(FavouritesService)
  private readonly _favorites = new BehaviorSubject<Favourite[]>([])
  readonly favorites$ = this._favorites.asObservable()
  get favorites(){
    return this._favorites.getValue()
  }
  set favorites(val: Favourite[]){
    this._favorites.next(val)
  }
  like(idProduct: number){
    this.favoritesService.addToFavourites(idProduct)
    .pipe(
      tap( res => {
        const favorite:Favourite = {id_favourite: res.id_favourite, id_item: idProduct}
        this._favorites.next([...(this._favorites.getValue() || []), favorite])
      })
    )
    .subscribe()
  }
  unlike(idFavorite: number){
    this._favorites.next(this.favorites.filter( f => f.id_favourite != idFavorite))
    this.favoritesService.deleteFavourite(idFavorite)
    .subscribe()
  }
  init(){
    this.favoritesService.getFavourites()
    .pipe(
      tap( res => this._favorites.next(res))
    )
    .subscribe()
  }
}
