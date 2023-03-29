import {
  AfterContentInit,
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  ViewChild,
} from "@angular/core";
import { CommonModule, NgOptimizedImage } from "@angular/common";
import { Item } from "src/app/shared/interfaces/item/item";
import { MatCardModule } from "@angular/material/card";
import { BreakpointObserver, Breakpoints } from "@angular/cdk/layout";
import { catchError, debounceTime, map, switchMap, take, tap } from "rxjs/operators";
import { MatButton, MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { RouterModule } from "@angular/router";
import { ProductsService } from "../../../../services/products.service";
import { BidService } from "src/app/core/http/bid.service";
import { TimeLeftPipe } from "src/app/shared/pipes/time-left.pipe";
import { fromEvent, Observable, of, Subject, Subscription } from "rxjs";
import { AuthService } from "src/app/core/auth/auth.service";
import { MatChipsModule } from "@angular/material/chips";
import { MatTooltip, MatTooltipModule } from "@angular/material/tooltip";
import { FavoritesStore } from "src/app/dashboard/pages/services/favorites.store";
import { Favourite } from "src/app/shared/interfaces/favourite";
import { LikeButtonComponent } from "src/app/shared/components/like-button/like-button.component";

@Component({
  selector: "app-product",
  standalone: true,
  imports: [
    CommonModule,
    NgOptimizedImage,
    MatButtonModule,
    MatIconModule,
    RouterModule,
    TimeLeftPipe,
    MatChipsModule,
    MatTooltipModule,
    LikeButtonComponent
  ],
  templateUrl: "./product.component.html",
  styleUrls: ["./product.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductComponent implements OnInit, OnDestroy{
  @Input() product: Item;
  private bidService = inject(BidService);
  private productsService = inject(ProductsService);
  private favoritesStore = inject(FavoritesStore)
  private breakpoints = inject(BreakpointObserver);
  private authService = inject(AuthService);
  private sub: Subscription;
  favourite$: Observable<Favourite | null>
  showFavIcon: boolean = false;
  userId: number | null;
  bidPrice: number;
  isLtMd$ = this.breakpoints
    .observe([Breakpoints.XSmall, Breakpoints.Small])
    .pipe(map((v) => v.matches));

  ngOnInit(): void{
    this.userId = this.authService.getUserId();
    if(this.userId){
      this.favourite$ = this.favoritesStore.favorites$
      .pipe(
        map( fs => (fs && fs.find( f => f.id_item == this.product.id_item) as Favourite) || null),
        tap( fs => fs ? this.showFavIcon = true : this.showFavIcon = false),
      );

    }
  }
  bid() {
    this.productsService
      .openBidModal(
        this.product.id_item,
        this.product.max_bid || this.product.starting_price
      )
      .afterClosed()
      .pipe(
        tap((bidPrice) => (this.bidPrice = bidPrice)),
        switchMap((bidPrice) => {
          if (bidPrice && this.userId) {
            this.product.max_bid = bidPrice;
            this.product.id_bidder = this.userId
            return this.bidService.bid(this.product.id_item, bidPrice);
          }
          return of(null);
        }),
        tap((r) =>
          r ? (this.product.max_bid = this.bidPrice) : null
        )
      )
      .subscribe();
  }
  ngOnDestroy(): void {
    if(this.sub)
    this.sub.unsubscribe()
  }
}
