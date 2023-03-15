import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Item } from 'src/app/shared/interfaces/item/item';
import { ProductComponent } from './components/product/product.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-products-list',
  standalone: true,
  imports: [CommonModule, ProductComponent, MatPaginatorModule],
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.scss']
})
export class ProductsListComponent  {
  @Input() products: Item[] | null;


}