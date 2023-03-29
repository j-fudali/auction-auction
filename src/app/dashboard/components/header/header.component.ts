import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatButtonModule } from "@angular/material/button";
import { RouterModule } from "@angular/router";
import { MatIconModule } from "@angular/material/icon";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { MatBadgeModule } from "@angular/material/badge";

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
  @Input() isAuthenticated: boolean;
  @Input() newsCount: number;
  @Output() toggleSidenavMenu = new EventEmitter<void>();
  @Output() onToggleRightSidenav = new EventEmitter<void>();
  @Output() logoutEvent = new EventEmitter<void>();
  search = new FormControl("");
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
