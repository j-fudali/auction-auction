import { Component, inject, OnDestroy, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ItemsService } from "src/app/core/http/items.service";
import { MatSidenavModule } from "@angular/material/sidenav";
import { FiltersPanelComponent } from "../../../shared/components/filters-panel/filters-panel.component";
import { MatPaginatorModule, PageEvent } from "@angular/material/paginator";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { map, switchMap, takeUntil, tap } from "rxjs/operators";
import { concat, forkJoin, of, Subject } from "rxjs";
import { ItemsFilters } from "src/app/shared/interfaces/item/items-filters";
import { BreakpointObserver, Breakpoints } from "@angular/cdk/layout";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { ProductsListComponent } from "./components/products-list/products-list.component";
import { Item } from "src/app/shared/interfaces/item/item";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthService } from "src/app/core/auth/auth.service";
import { CategoriesService } from "src/app/core/http/categories.service";
import { Category } from "src/app/shared/interfaces/category/category";
import { MatDialog } from "@angular/material/dialog";
import { CreateAuctionModalComponent } from "./components/create-auction-modal/create-auction-modal.component";
import { DateTime } from "luxon";
import { MatTooltipModule } from "@angular/material/tooltip";
import { HeaderService } from "../../services/header.service";

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
    MatTooltipModule,
  ],
  templateUrl: "./products.component.html",
  styleUrls: ["./products.component.scss"],
})
export class ProductsComponent implements OnInit, OnDestroy {
  private itemService = inject(ItemsService);
  private headerService = inject(HeaderService);
  private breakpoints = inject(BreakpointObserver);
  private categoriesService = inject(CategoriesService);
  private authService = inject(AuthService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private dialog = inject(MatDialog);
  private destroy$ = new Subject();
  isLtMd$ = this.breakpoints.observe([Breakpoints.XSmall, Breakpoints.Small]);

  //State
  isAuthenticated: boolean = false;
  products: Item[];

  categories: Category[];
  loading: boolean;
  itemsCount: number;

  itemsFilters: ItemsFilters | undefined = undefined;
  bidPrice: number;

  ngOnInit(): void {
    this.authService.setUserId(this.route.snapshot.data.userId);
    this.isAuthenticated = this.authService.isAuthenticated();
    this.itemsCount = +this.route.snapshot.data.products.items_count;
    this.products = this.route.snapshot.data.products.result;
    this.categoriesService
      .getCategories()
      .pipe(tap((categories) => (this.categories = categories)))
      .subscribe();
    this.route.queryParams
      .pipe(takeUntil(this.destroy$))
      .subscribe((params) => this.filterProducts({ search: params.search }));
    this.headerService.onReset$
      .pipe(takeUntil(this.destroy$))
      .subscribe((v) => {
        if (v === true) {
          this.headerService.onReset = false;
          this.filterProducts({});
        }
      });
  }

  createAuction() {
    const dialogRef = this.dialog.open(CreateAuctionModalComponent, {
      data: {
        categories: this.categories,
      },
      minWidth: "30vw",
    });
    dialogRef
      .afterClosed()
      .pipe(
        switchMap((res) => {
          if (!res) return of(null);
          res.data.endingTime = (res.data.endingTime as DateTime)
            .toUTC()
            .toFormat("dd.MM.yyyy hh:mm:ss");
          return this.itemService.createNewItem(res.data).pipe(
            map((newItemRes) => {
              return { id_item: newItemRes.id_item, images: res.images };
            })
          );
        }),
        switchMap((res) => {
          if (!res?.id_item || !res.images || (res.images && res.images <= 0))
            return of({ id_item: res?.id_item });
          const mainImage = this.itemService.addImagesToItem(
            res.id_item,
            res.images.shift(),
            "True"
          );
          return concat(
            ...[
              mainImage,
              ...res.images.map((i: File) =>
                this.itemService.addImagesToItem(res.id_item, i, "False")
              ),
            ]
          ).pipe(
            map(() => {
              return { id_item: res.id_item };
            })
          );
        }),
        tap((res) => {
          if (res.id_item)
            this.router.navigate(["/dashboard/products", res.id_item]);
        })
      )
      .subscribe();
  }

  onPageChange(page: PageEvent) {
    if (this.itemsFilters) {
      this.itemsFilters.page = page.pageIndex + 1;
    } else {
      this.itemsFilters = { page: page.pageIndex + 1 };
    }
    this.loadProducts();
    window.scrollTo(0, 0);
  }

  filterProducts(itemsFilters: ItemsFilters) {
    if (!itemsFilters) this.itemsFilters = undefined;
    if (itemsFilters) this.itemsFilters = itemsFilters;
    this.loadProducts();
  }

  private loadProducts() {
    this.loading = true;
    this.itemService
      .getItems(this.itemsFilters)
      .pipe(
        tap((res) => {
          this.itemsCount = +res.items_count;
        }),
        map((res) => res.result)
      )
      .subscribe((items) => {
        this.loading = false;
        this.products = items;
      });
  }
  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
