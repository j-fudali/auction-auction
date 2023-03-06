import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Item } from 'src/app/shared/interfaces/item/item';
import { MatRow, MatTableModule } from '@angular/material/table';
import { TimeLeftPipe } from 'src/app/shared/pipes/time-left.pipe';
import { ItemsTableDataSourceService } from 'src/app/core/util/items-table-data-source.service';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-products-table',
  standalone: true,
  imports: [CommonModule, MatTableModule, TimeLeftPipe, MatIconModule, MatButtonModule],
  templateUrl: './products-table.component.html',
  styleUrls: ['./products-table.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class ProductsTableComponent {
  @Input() productsDataSource: ItemsTableDataSourceService;
  @Output() onRedirectToProductDetails = new EventEmitter<number>();
  displayedColumns = ['image', 'name', 'category', 'ending_price', 'timeout']
  columnsToDisplayWithExpand = [...this.displayedColumns, 'expand']
  expandedElement: Item | null;
  goToDetails(item: Item){
    this.onRedirectToProductDetails.emit(item.id_item)
  }
}
