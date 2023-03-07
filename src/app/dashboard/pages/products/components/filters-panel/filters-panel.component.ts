import { Component, EventEmitter, inject, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { ItemsFilters } from 'src/app/shared/interfaces/item/items-filters';

@Component({
  selector: 'app-filters-panel',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule],
  templateUrl: './filters-panel.component.html',
  styleUrls: ['./filters-panel.component.scss']
})
export class FiltersPanelComponent {
  @Output() onFilterProducts = new EventEmitter<ItemsFilters>()
  private fb = inject(FormBuilder);
  filtersForm = this.fb.group({
    search: [''],
    orderBy: [''],
    category: ['']
  })

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
