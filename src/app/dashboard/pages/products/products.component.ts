import {
  AfterContentInit,
  Component,
  inject,
  OnChanges,
  OnInit,
  SimpleChanges,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { ItemsService } from "src/app/core/http/items.service";
import { MatSidenavModule } from "@angular/material/sidenav";
import { FiltersPanelComponent } from "./components/filters-panel/filters-panel.component";
import { MatPaginatorModule, PageEvent } from "@angular/material/paginator";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { catchError, filter, finalize, map, take, takeUntil, tap } from "rxjs/operators";
import { Observable, of, Subscription, throwError } from "rxjs";
import { ItemsFilters } from "src/app/shared/interfaces/item/items-filters";
import { BreakpointObserver, Breakpoints } from "@angular/cdk/layout";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { ProductsListComponent } from "./components/products-list/products-list.component";
import { Item } from "src/app/shared/interfaces/item/item";
import { ActivatedRoute, NavigationEnd, Router, RouterEvent } from "@angular/router";
import { AuthService } from "src/app/core/auth/auth.service";
import { CategoriesService } from "src/app/core/http/categories.service";
import { Category } from "src/app/shared/interfaces/category/category";
import { UserService } from "src/app/core/http/user.service";
import { MatDialog } from "@angular/material/dialog";
import { CreateAuctionModalComponent } from "./components/create-auction-modal/create-auction-modal.component";


@Component({
  standalone: true,
  imports: [
    CommonModule,
    MatSidenavModule,
    FiltersPanelComponent,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatIconModule,
    ProductsListComponent,
    MatPaginatorModule,
  ],
  templateUrl: "./products.component.html",
  styleUrls: ["./products.component.scss"],
})
export class ProductsComponent implements OnInit {
  private itemService = inject(ItemsService);
  private breakpoints = inject(BreakpointObserver);
  private categoriesService = inject(CategoriesService);
  private authService = inject(AuthService)
  private route = inject(ActivatedRoute)
  private dialog = inject(MatDialog)
  isLtMd$ = this.breakpoints.observe([Breakpoints.XSmall, Breakpoints.Small]);

  //State
  isAuthenticated: boolean = false
  products: Item[];

  categories$: Observable<Category[]>;
  loading: boolean;
  itemsCount: number;

  itemsFilters: ItemsFilters | undefined = undefined;
  bidPrice: number;

  ngOnInit(): void {
    this.authService.setUserId(this.route.snapshot.data.userId)
    this.isAuthenticated = this.authService.isAuthenticated()
    this.itemsCount = +this.route.snapshot.data.products.items_count
    this.products = this.route.snapshot.data.products.result
    this.categories$ = this.categoriesService.getCategories();
  }

  createAuction(){
    const dialogRef = this.dialog.open(CreateAuctionModalComponent, {
      data: {
        categories$: this.categories$,
      },
    })
    dialogRef.afterClosed().subscribe(console.log)  
  }

  onPageChange(page: PageEvent) {
    if(this.itemsFilters) {
      this.itemsFilters.page = page.pageIndex + 1
    }
    else {
      this.itemsFilters = {page: page.pageIndex + 1}
    }
    this.loadProducts();
  }
  reload(){
    this.loadProducts();
  }
  filterProducts(itemsFilters: ItemsFilters) {
    if (!itemsFilters) this.itemsFilters = undefined;
    if (itemsFilters) this.itemsFilters = itemsFilters;
    this.loadProducts();
  }

  private loadProducts() {
    this.itemService
      .getItems(this.itemsFilters)
      .pipe(
        tap((res) => {
          this.loading = true;
          this.itemsCount = +res.items_count;
        }),
        map((res) => res.result),
        finalize(() => (this.loading = false))
      )
      .subscribe((items) => (this.products = items));
  }
}
