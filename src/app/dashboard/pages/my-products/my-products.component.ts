import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { MatTabChangeEvent, MatTabsModule } from '@angular/material/tabs';
import { UserService } from 'src/app/core/http/user.service';
import { Observable } from 'rxjs';
import { Item } from 'src/app/shared/interfaces/item/item';
import { map, tap } from 'rxjs/operators';
import { ItemsFilters, MyItemsFilters } from 'src/app/shared/interfaces/item/items-filters';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { PaginatedResponse } from 'src/app/shared/interfaces/paginated-response';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { TimeLeftPipe } from 'src/app/shared/pipes/time-left.pipe';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';
import { FiltersPanelComponent } from 'src/app/shared/components/filters-panel/filters-panel.component';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Component({
  standalone: true,
  imports: [CommonModule, 
    RouterModule, TimeLeftPipe, MatSidenavModule, FiltersPanelComponent,
    MatListModule, MatTabsModule, MatProgressSpinnerModule, MatPaginatorModule, MatButtonModule, MatIconModule],
  templateUrl: './my-products.component.html',
  styleUrls: ['./my-products.component.scss']
})
export class MyProductsComponent implements OnInit{
  @ViewChild('drawer') drawer: MatDrawer;
  private usersService = inject(UserService)
  private breakpoints = inject(BreakpointObserver)
  isLtMd$ = this.breakpoints.observe([Breakpoints.XSmall, Breakpoints.Small]).pipe(map( v => v.matches))
  isLoading: boolean;
  products: Item[]
  filters: MyItemsFilters = {type: 'created'};
  length: number
  ngOnInit(): void {
    this.loadProducts()
  }
  onTabChange(v : MatTabChangeEvent){
    this.filters = {}
    switch(v.index){
      case 0:
        this.filters.type = 'created'
        break;
      case 1:
        this.filters.type = 'participated'
        break;
      case 2:
        this.filters.type = 'ended'
        break;
      case 3:
        this.filters.type = 'won'
        break;
      default:
        this.filters.type = 'created'
    }
    this.loadProducts()
  }
  onPageChange(page: PageEvent){
    this.filters.page = page.pageIndex + 1
    this.loadProducts()
    window.scrollTo(0,0)
  }
  filter(itemsFilters: ItemsFilters){
    if(!itemsFilters) this.filters = {page: this.filters.page, type: this.filters.type}
    if(itemsFilters){
      this.filters.category = itemsFilters.category
      this.filters.orderBy = itemsFilters.orderBy
      this.filters.search = itemsFilters.search
    }
    this.loadProducts()
  }
  private loadProducts(){
    this.isLoading = true
    this.usersService.getMyProducts(this.filters).subscribe(
      res => {
        this.products = res.result
        this.length = res.items_count
        this.isLoading = false;
      }
    )
  }
}
