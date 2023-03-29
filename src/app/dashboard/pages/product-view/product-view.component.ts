import {
  Component,
  ElementRef,
  EventEmitter,
  inject,
  OnInit,
  Output,
  ViewChild,
} from "@angular/core";
import { CommonModule, NgOptimizedImage } from "@angular/common";
import { ActivatedRoute, Router } from "@angular/router";
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
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { FormControl, ReactiveFormsModule, Validators } from "@angular/forms";
import { DiscussionsService } from "src/app/core/http/discussions.service";
import { DiscussionsStore } from "../services/discussions.store";
import { Discussion } from "src/app/shared/interfaces/discussion/discussion";
import { MatSnackBar } from "@angular/material/snack-bar";
import { LikeButtonComponent } from "src/app/shared/components/like-button/like-button.component";
import { Favourite } from "src/app/shared/interfaces/favourite";
import { FavoritesStore } from "../services/favorites.store";

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
    MatTooltipModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    LikeButtonComponent
  ],
  templateUrl: "./product-view.component.html",
  styleUrls: ["./product-view.component.scss"],
})
export class ProductViewComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private breakpoints = inject(BreakpointObserver);
  private bidService = inject(BidService)
  private bidModal = inject(ProductsService);
  private discussionService = inject(DiscussionsService)
  private discussionStore = inject(DiscussionsStore)
  private favoritesStore = inject(FavoritesStore)
  private router = inject(Router)
  userId: number | null;

  isLtGt$ = this.breakpoints
    .observe([Breakpoints.XSmall, Breakpoints.Small])
    .pipe(map((v) => v.matches));
  product: ParticularItem | null;
  productId: number;
  translateX: number = 0;
  imageIndex: number = 0;
  isZoomed: boolean = false;

  newDiscussionContent = new FormControl('', Validators.required)

  favourite$: Observable<Favourite | null>
  showFavIcon: boolean = false;

  ngOnInit(): void {
    this.product = this.route.snapshot.data.product
    this.productId = +this.route.snapshot.paramMap.get('id')!;
    this.userId = this.route.snapshot.data.userId
    if(this.userId){
      this.favourite$ = this.favoritesStore.favorites$
      .pipe(
        map( fs => (fs && fs.find( f => f.id_item == this.productId) as Favourite) || null),
        tap( fs => fs ? this.showFavIcon = true : this.showFavIcon = false),
      );
    }
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
        switchMap((bidPrice: number) => {
          if (bidPrice && this.userId) {
            this.product!.max_bid = bidPrice;
            this.product!.id_bidder = this.userId
            return this.bidService.bid(this.productId, bidPrice);
          }
          return of(null);
        }),
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
  submit(){
    if(this.newDiscussionContent.dirty && this.newDiscussionContent.valid && this.newDiscussionContent.value){
      this.discussionService.createNewDiscussion(this.productId, this.newDiscussionContent.value)
      .pipe(
        tap(() => this.router.navigate(['/dashboard/discussions'])),
        tap((res) => this.discussionStore.selectedDiscussion = res.id_discussion)
      )
      .subscribe()
    }
  }
}
