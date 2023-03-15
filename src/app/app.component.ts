import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule,RouterModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

}
