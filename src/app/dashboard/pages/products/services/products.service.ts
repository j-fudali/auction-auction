import { inject, Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { BidModalComponent } from '../components/bid-modal/bid-modal.component';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private modal = inject(MatDialog)
  openBidModal(idItem: number, price: string): MatDialogRef<BidModalComponent> {
    return this.modal.open(BidModalComponent, {
      data: {
        idItem,
        price: +price
      },
      maxHeight: 300,
      maxWidth: 300      
    })
    
  }
}
