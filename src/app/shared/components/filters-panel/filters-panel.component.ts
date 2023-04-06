import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, EventEmitter, inject, Input, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { ItemsFilters } from 'src/app/shared/interfaces/item/items-filters';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';
import { MatIconModule } from '@angular/material/icon';
import { Category } from 'src/app/shared/interfaces/category/category';
import { CategoriesService } from 'src/app/core/http/categories.service';

@Component({
  selector: 'app-filters-panel',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, MatIconModule],
  templateUrl: './filters-panel.component.html',
  styleUrls: ['./filters-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FiltersPanelComponent {
  @Input() showSearchBar: boolean = true;
  @Input() categories: Category[];
  @Output() onFilterProducts = new EventEmitter<ItemsFilters>()
  @Output() onClose = new EventEmitter<void>()
  private breakpoints = inject(BreakpointObserver)
  private fb = inject(FormBuilder);
  isLtMd$ = this.breakpoints.observe([Breakpoints.XSmall, Breakpoints.Small]).pipe(map( v => v.matches));
  filtersForm = this.fb.group({
    search: [''],
    orderBy: [''],
    category: ['']
  })

  close() {
    this.onClose.emit()
  }
  reset(){
    this.filtersForm.reset()
    this.onFilterProducts.emit()
  }
  onSubmit(){
    const search = this.filtersForm.get('search')?.value
    const orderBy = this.filtersForm.get('orderBy')?.value
    const category = this.filtersForm.get('category')?.value
    const itemsFilters: ItemsFilters = {};
    if(search) itemsFilters.search = search;
    if(category) itemsFilters.category = category;
    if(orderBy) itemsFilters.orderBy = orderBy;
    this.onFilterProducts.emit(itemsFilters)
  }
}
