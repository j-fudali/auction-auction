import {
  Component,
  ElementRef,
  inject,
  OnInit,
  ViewChild,
} from "@angular/core";
import { CommonModule, NgOptimizedImage } from "@angular/common";
import { ActivatedRoute } from "@angular/router";
import { catchError, map, switchMap, tap } from "rxjs/operators";
import { ItemsService } from "src/app/core/http/items.service";
import { Observable, of, throwError } from "rxjs";
import { Item } from "src/app/shared/interfaces/item/item";
import { HttpErrorResponse } from "@angular/common/http";
import { TimeLeftPipe } from "src/app/shared/pipes/time-left.pipe";
import { ParticularItem } from "src/app/shared/interfaces/item/particular-item";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatDividerModule } from "@angular/material/divider";
import { MatChipsModule } from "@angular/material/chips";
import { BreakpointObserver, Breakpoints } from "@angular/cdk/layout";
import { AuthService } from "src/app/core/auth/auth.service";
import { BidService } from "src/app/core/http/bid.service";
import { ProductsService } from "../products/services/products.service";
import { UserService } from "src/app/core/http/user.service";
import { MatCardModule } from "@angular/material/card";
import { DragDropModule } from "@angular/cdk/drag-drop";
import { MatTooltipModule } from "@angular/material/tooltip";

@Component({
  standalone: true,
  imports: [
    CommonModule,
    TimeLeftPipe,
    NgOptimizedImage,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatDividerModule,
    MatCardModule,
    MatTooltipModule
  ],
  templateUrl: "./product-view.component.html",
  styleUrls: ["./product-view.component.scss"],
})
export class ProductViewComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private breakpoints = inject(BreakpointObserver);
  private bidService = inject(BidService)
  private bidModal = inject(ProductsService);
  userId: string | null;

  isLtGt$ = this.breakpoints
    .observe([Breakpoints.XSmall, Breakpoints.Small])
    .pipe(map((v) => v.matches));
  product: ParticularItem | null;
  productId: number;
  translateX: number = 0;
  imageIndex: number = 0;
  isZoomed: boolean = false;


  ngOnInit(): void {
    this.product = this.route.snapshot.data.product
    this.userId = this.route.snapshot.data.userId
  }
  bid() {
    this.bidModal
      .openBidModal(
        this.productId,
        this.product!.max_bid || this.product!.starting_price
      )
      .afterClosed()
      .pipe(
        tap((bidPrice) => (this.product!.max_bid = bidPrice)),
        switchMap((bidPrice) => {
          if (bidPrice && this.userId) {
            this.product!.max_bid = bidPrice;
            this.product!.id_bidder = this.userId
            return this.bidService.bid(this.productId, bidPrice);
          }
          return of(null);
        })
      )
      .subscribe();
  }
  previous() {
    if (this.imageIndex > 0) {
      this.translateX += 100;
      this.imageIndex--;
    }
  }
  next() {
    if (this.product && this.imageIndex < this.product.images.length - 1) {
      this.imageIndex++;
      this.translateX -= 100;
    }
  }
}
