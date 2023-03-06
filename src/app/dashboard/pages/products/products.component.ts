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
import { tap } from "rxjs/operators";
import { Observable, Subscription } from "rxjs";
import { Router } from "@angular/router";
@Component({
  standalone: true,
  imports: [
    CommonModule,
    MatSidenavModule,
    ProductsTableComponent,
    FiltersPanelComponent,
    MatPaginatorModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: "./products.component.html",
  styleUrls: ["./products.component.scss"],
})
export class ProductsComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild("paginator") paginator: MatPaginator;
  @ViewChild("scrollTo") scrollTo: ElementRef<HTMLDivElement>;
  private sub: Subscription;
  private itemsService = inject(ItemsService);
  private router = inject(Router);
  productsDataSource: ItemsTableDataSourceService;
  itemsCount$ = this.itemsService.itemsCount$
  ngOnInit(): void {
    this.productsDataSource = new ItemsTableDataSourceService(
      this.itemsService
    );
    this.productsDataSource.loadProducts();

  }
  ngAfterViewInit(): void {
    this.sub = this.paginator.page
      .pipe(
        tap( () => {
          this.productsDataSource.loadProducts(this.paginator.pageIndex + 1)
          this.scrollTo.nativeElement.scrollIntoView()
        })
      )
      .subscribe();
  }

  redirectToProductView(id: number){
    this.router.navigate(['/dashboard/product/', id])
  }



  ngOnDestroy(): void {
    this.sub.unsubscribe()
  }
}
