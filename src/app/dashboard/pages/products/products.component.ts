import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  OnDestroy,
  OnInit,
  ViewChild,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatTable, MatTableModule } from "@angular/material/table";
import { ItemsService } from "src/app/core/http/items.service";
import { MatDrawerContent, MatSidenavModule } from "@angular/material/sidenav";
import { ProductsTableComponent } from "./components/products-table/products-table.component";
import { FiltersPanelComponent } from "./components/filters-panel/filters-panel.component";
import { ItemsTableDataSourceService } from "src/app/core/util/items-table-data-source.service";
import { MatPaginator, MatPaginatorModule } from "@angular/material/paginator";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { switchMap, tap } from "rxjs/operators";
import { Observable, Subscription } from "rxjs";
import { Router } from "@angular/router";
import { ItemsFilters } from "src/app/shared/interfaces/item/items-filters";
import { MatDialog, MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { BidModalComponent } from "./components/bid-modal/bid-modal.component";
import { BidService } from "src/app/core/http/bid.service";
@Component({
  standalone: true,
  imports: [
    CommonModule,
    MatSidenavModule,
    ProductsTableComponent,
    FiltersPanelComponent,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatDialogModule,
  ],
  templateUrl: "./products.component.html",
  styleUrls: ["./products.component.scss"],
})
export class ProductsComponent implements OnInit, AfterViewInit, OnDestroy {
  private itemsService = inject(ItemsService);
  private bidService = inject(BidService)
  private router = inject(Router);
  private modal = inject(MatDialog);
  @ViewChild("paginator") paginator: MatPaginator;
  private sub: Subscription;
  productsDataSource: ItemsTableDataSourceService;
  itemsCount$ = this.itemsService.itemsCount$;
  itemsFilters: ItemsFilters | null;
  ngOnInit(): void {
    this.productsDataSource = new ItemsTableDataSourceService(
      this.itemsService
    );
    this.productsDataSource.loadProducts();
  }
  ngAfterViewInit(): void {
    this.sub = this.paginator.page
      .pipe(
        tap(() => {
          if (this.itemsFilters) {
            this.itemsFilters;
          }
          const filter: ItemsFilters = { page: this.paginator.pageIndex + 1 };
          this.productsDataSource.loadProducts(filter);
        })
      )
      .subscribe();
  }
  filterProducts(itemsFilter: ItemsFilters) {
    this.itemsFilters = itemsFilter;
  }
  redirectToProductView(id: number) {
    this.router.navigate(["/dashboard/product/", id]);
  }

  openBidModal({idItem, minBidPrice}: {idItem: number, minBidPrice: number}) {
    const dialogRef = this.modal.open(BidModalComponent, {
      data: {
        idItem,
        minBidPrice
      },
      maxHeight: 300,
      maxWidth: 300      
    })
    dialogRef.afterClosed().pipe(
      tap((bidPrice) => this.productsDataSource.updateMaxBid(bidPrice, idItem)),
      switchMap(bidPrice => this.bidService.bid(idItem, bidPrice))
    )
    .subscribe()
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
