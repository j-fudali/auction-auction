import { Component, EventEmitter, Input, OnInit, Output, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatButtonModule } from "@angular/material/button";
import { Router, RouterModule } from "@angular/router";
import { MatIconModule } from "@angular/material/icon";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { FormControl, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { MatBadgeModule } from "@angular/material/badge";
import { BreakpointObserver, Breakpoints } from "@angular/cdk/layout";
import { map } from "rxjs/operators";
import { HeaderService } from "../../pages/services/header.service";

@Component({
  selector: "app-header",
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    RouterModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatButtonToggleModule,
    MatBadgeModule

  ],
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"],
})
export class HeaderComponent{
  private router = inject(Router)
  private breakpoints = inject(BreakpointObserver)
  private headerService = inject(HeaderService)
  @Input() isAuthenticated: boolean;
  @Input() newsCount: number;
  @Output() toggleSidenavMenu = new EventEmitter<void>();
  @Output() onToggleRightSidenav = new EventEmitter<void>();
  @Output() logoutEvent = new EventEmitter<void>();
  search = new FormControl("");
  isLtMd$ = this.breakpoints.observe([Breakpoints.XSmall, Breakpoints.Small]).pipe(map( v => v.matches))
  onSearch(){
    if(this.search.dirty && this.search.value){
      this.router.navigate(['/dashboard/products'], {queryParams: {search: this.search.value}})
    }
  }
  reset(){
    this.router.navigate(['/dashboard/products'])
    this.search.reset()
    this.headerService.onReset = true;
  }
  logout() {
    this.logoutEvent.emit();
  }
  toggleSidenav() {
    this.toggleSidenavMenu.emit();
  }
  toggleRightSidenav(){
    this.onToggleRightSidenav.emit()
  }
}
