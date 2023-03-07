import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';
import { Item } from 'src/app/shared/interfaces/item/item';
import { ItemsFilters } from 'src/app/shared/interfaces/item/items-filters';
import { ItemsService } from '../http/items.service';

@Injectable({
  providedIn: 'root'
})
export class ItemsTableDataSourceService implements DataSource<Item>{
  private itemsSubject = new BehaviorSubject<Item[]>([])
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable()
  constructor(private itemsService: ItemsService){}
  connect(collectionViewer: CollectionViewer): Observable<readonly Item[]> {
    return this.itemsSubject.asObservable()
  }
  disconnect(collectionViewer: CollectionViewer): void {
    this.itemsSubject.complete()
  }
  loadProducts(itemsFilters?: ItemsFilters): void {
    this.loadingSubject.next(true)
    this.itemsService.getItems(itemsFilters)
    .pipe(
      finalize(() => this.loadingSubject.next(false))
      )
    .subscribe( items => this.itemsSubject.next(items))
  }
  updateMaxBid(price: number, idItem: number){
    const items = this.itemsSubject.getValue()
    const updateItems = items.map( i => {
      if(i.id_item === idItem){
        i.max_bid = price
      }
      return i
    })
    this.itemsSubject.next(updateItems);
  }
}
