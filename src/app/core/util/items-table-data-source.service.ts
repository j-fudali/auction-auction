import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { Item } from 'src/app/shared/interfaces/item/item';
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
  loadProducts(page?: number, orderBy?: string, category?: string, search?: string): void {
    this.loadingSubject.next(true)
    this.itemsService.getItems(page, orderBy, category, search)
    .pipe(
      finalize(() => this.loadingSubject.next(false))
      )
    .subscribe( items => this.itemsSubject.next(items))
  }
}
