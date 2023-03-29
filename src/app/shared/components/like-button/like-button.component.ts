import { Component, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Favourite } from '../../interfaces/favourite';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, tap } from 'rxjs/operators';
import { FavoritesStore } from 'src/app/dashboard/pages/services/favorites.store';

@Component({
  selector: 'app-like-button',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule],
  templateUrl: './like-button.component.html',
  styleUrls: ['./like-button.component.scss']
})
export class LikeButtonComponent implements OnInit, OnDestroy{
  @Input() productId: number;
  @Input() favorite: Favourite | null;
  @Input() showFavIcon: boolean;
  private sub: Subscription;
  private onClickButton$ = new Subject<{action: string, id: number}>()
  private favoritesStore = inject(FavoritesStore)
  ngOnInit(): void {
    this.sub = this.onClickButton$.pipe(
      debounceTime(1000),
      tap( v => v.action == 'like' ? this.favoritesStore.like(v.id) : this.favoritesStore.unlike(v.id)),
    )
    .subscribe()
  }
  like(idProduct: number){
    this.showFavIcon = true;
    this.onClickButton$.next({action: 'like', id: idProduct})
  }
  unlike(idFavourite: number){
    this.showFavIcon = false;
    this.onClickButton$.next({action: 'unlike', id: idFavourite})
  }
  ngOnDestroy(): void {
    if(this.sub) this.sub.unsubscribe()
  }
}
