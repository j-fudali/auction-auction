import {
  AfterContentInit,
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
  OnChanges,
  OnInit,
} from "@angular/core";
import { CommonModule, NgOptimizedImage } from "@angular/common";
import { Item } from "src/app/shared/interfaces/item/item";
import { MatCardModule } from "@angular/material/card";
import { BreakpointObserver, Breakpoints } from "@angular/cdk/layout";
import { map, switchMap, tap } from "rxjs/operators";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { RouterModule } from "@angular/router";
import { ProductsService } from "../../../../services/products.service";
import { BidService } from "src/app/core/http/bid.service";
import { TimeLeftPipe } from "src/app/shared/pipes/time-left.pipe";
import { Observable, of } from "rxjs";
import { AuthService } from "src/app/core/auth/auth.service";
import { MatChipsModule } from "@angular/material/chips";

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
    MatChipsModule
  ],
  templateUrl: "./product.component.html",
  styleUrls: ["./product.component.scss"],
})
export class ProductComponent implements OnInit{
  @Input() product: Item;
  private bidService = inject(BidService);
  private productsService = inject(ProductsService);
  private breakpoints = inject(BreakpointObserver);
  private authService = inject(AuthService);
  userId: string | null;
  bidPrice: number;
  isLtMd$ = this.breakpoints
    .observe([Breakpoints.XSmall, Breakpoints.Small])
    .pipe(map((v) => v.matches));

  ngOnInit(): void{
    this.userId = this.authService.getUserId();
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
          r ? (this.product.max_bid = this.bidPrice.toString()) : null
        )
      )
      .subscribe();
  }
}
