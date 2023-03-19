import { FooterComponent } from "./components/footer/footer.component";
import { HeaderComponent } from "./components/header/header.component";
import { Component, ElementRef, inject, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ActivatedRoute, NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router, RouterModule } from "@angular/router";
import { MatSidenav, MatSidenavModule } from "@angular/material/sidenav";
import { MatListModule } from "@angular/material/list";
import { BreakpointObserver, Breakpoints } from "@angular/cdk/layout";
import { filter, finalize, map, tap } from "rxjs/operators";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { AuthService } from "../core/auth/auth.service";
import { Subscription } from "rxjs";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";

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
  ],
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"],
})
export class DashboardComponent implements OnInit, OnDestroy{
  private authService = inject(AuthService);
  private router = inject(Router)
  private sub: Subscription | undefined;
  links = [
    {name: 'My profile', path: 'my-profile', isActive: false},
    {name: 'My products', path: 'my-products', isActive: false}
  ]
  isAuthenticated = this.authService.isAuthenticated();
  isLtMd$ = inject(BreakpointObserver)
    .observe([Breakpoints.XSmall, Breakpoints.Small])
    .pipe(map((val) => val.matches));
  ngOnInit(): void {
    this.setActive(this.splitPath(this.router.url))
    this.sub = this.router.events
    .pipe(
      filter( event => event instanceof NavigationEnd),
      tap( (event) => this.setActive(this.splitPath((event as NavigationEnd).url))),
    )
    .subscribe()
  }
  private splitPath(url:string){
    return url.split('/')[2]
  }
  setActive(linkPath: string){
    this.links.forEach( l => l.path === linkPath ? l.isActive = true : l.isActive = false);
  }
  logout() {
    this.authService.logout();
  }
  ngOnDestroy(): void {
    if(this.sub) this.sub.unsubscribe
  }
}
