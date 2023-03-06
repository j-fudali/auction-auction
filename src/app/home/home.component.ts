import { RouterModule } from '@angular/router';
import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, MatButtonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent  {
  @ViewChild('pages') pages: ElementRef<HTMLDivElement>
  private breakpoints = inject(BreakpointObserver)
  mdOrLtMd$ = this.breakpoints.observe([Breakpoints.XSmall, Breakpoints.Small, Breakpoints.Medium])
  .pipe(map(val => val.matches))

  slideToForm(){
    this.pages.nativeElement.scrollIntoView({ behavior: 'smooth' });
  }
}
