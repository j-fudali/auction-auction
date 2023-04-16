import { FooterComponent } from "./components/footer/footer.component";
import { HeaderComponent } from "./components/header/header.component";
import { Component, inject, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterModule,
} from "@angular/router";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatListModule } from "@angular/material/list";
import { BreakpointObserver, Breakpoints } from "@angular/cdk/layout";
import { filter, map, switchMap, tap } from "rxjs/operators";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { AuthService } from "../core/auth/auth.service";
import { forkJoin, Observable, of, Subscription } from "rxjs";
import { MatTabsModule } from "@angular/material/tabs";
import { FavouritesService } from "../core/http/favourites.service";
import { NotificationsService } from "../core/http/notifications.service";
import { Notification } from "../shared/interfaces/notification";
import { MatBadgeModule } from "@angular/material/badge";
import { DiscussionsStore } from "./services/discussions.store";
import { FavoritesStore } from "./services/favorites.store";
import { ItemsService } from "../core/http/items.service";
import { ParticularItem } from "../shared/interfaces/item/particular-item";

@Component({
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    HeaderComponent,
    FooterComponent,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatTabsModule,
    MatBadgeModule,
  ],
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"],
})
export class DashboardComponent implements OnInit, OnDestroy {
  private itemsService = inject(ItemsService);
  private authService = inject(AuthService);
  private favoritesStore = inject(FavoritesStore);
  private notificationsService = inject(NotificationsService);
  private discussionsStore = inject(DiscussionsStore);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private sub: Subscription | undefined;
  links = [
    { name: "My profile", path: "my-profile", isActive: false },
    { name: "My products", path: "my-products", isActive: false },
    { name: "Discussions", path: "discussions", isActive: false },
  ];
  isAuthenticated = this.authService.isAuthenticated();
  userId: number;
  isLtMd$ = inject(BreakpointObserver)
    .observe([Breakpoints.XSmall, Breakpoints.Small])
    .pipe(map((val) => val.matches));
  discussionsNotReadCount$: Observable<number>;
  notifications: Notification[];
  notificationsCount: number = 0;
  favorites$: Observable<
    { id_favourite: number; id_item: number; product: ParticularItem }[]
  >;
  favoritesCount: number;
  ngOnInit(): void {
    if (this.isAuthenticated) {
      this.userId = this.route.snapshot.data.userId;
      this.discussionsStore.init();
      this.discussionsNotReadCount$ = this.discussionsStore.discussions$.pipe(
        map(
          (ds) =>
            ds.filter((d) => d.id_sender != this.userId && d.is_read == 0)
              .length
        )
      );

      this.favoritesStore.init();
      this.favorites$ = this.favoritesStore.favorites$.pipe(
        switchMap((fs) => {
          if (fs && fs.length > 0) {
            return forkJoin(
              fs.map((f) =>
                this.itemsService.getItemById(f.id_item).pipe(
                  map((res) => {
                    return {
                      id_favourite: f.id_favourite,
                      id_item: f.id_item,
                      product: res,
                    };
                  })
                )
              )
            );
          }
          return of([]);
        }),
        tap((fs) => (this.favoritesCount = fs.length))
      );
      this.notificationsService
        .getAllUserNotifications()
        .pipe(
          tap((n) => (this.notifications = n)),
          tap((n) => (this.notificationsCount = n ? n.length : 0))
        )
        .subscribe();
    }
    this.setActive(this.splitPath(this.router.url));
    this.sub = this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        tap((event) =>
          this.setActive(this.splitPath((event as NavigationEnd).url))
        )
      )
      .subscribe();
  }

  unlike(idFavorite: number) {
    this.favoritesStore.unlike(idFavorite);
  }
  deleteNotification(idNotification: number) {
    this.notificationsCount--;
    this.notificationsService.deleteNotification(idNotification).subscribe();
    this.notifications = this.notifications.filter(
      (n) => n.id_notification !== idNotification
    );
  }
  logout() {
    this.authService.logout();
  }
  ngOnDestroy(): void {
    if (this.sub) this.sub.unsubscribe;
  }
  private splitPath(url: string) {
    return url.split("/")[2];
  }
  private setActive(linkPath: string) {
    this.links.forEach((l) =>
      l.path === linkPath ? (l.isActive = true) : (l.isActive = false)
    );
  }
}
