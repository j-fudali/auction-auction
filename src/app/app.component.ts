import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivatedRoute, NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule,RouterModule, MatProgressSpinnerModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy{
  private router = inject(Router)
  private sub: Subscription;
  isLoading: boolean = false;
  ngOnInit(): void {
    this.sub = this.router.events.pipe(
      tap( event => {
        if (event instanceof NavigationStart) {
          this.isLoading = true
        }
        if (event instanceof NavigationEnd) {
          this.isLoading = false
        }
    
        if (event instanceof NavigationCancel) {
          this.isLoading = false
        }
        if (event instanceof NavigationError) {
          this.isLoading = false
        }
      })
    )
    .subscribe()
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe()
  }
}
