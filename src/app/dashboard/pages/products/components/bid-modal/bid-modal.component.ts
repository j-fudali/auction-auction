import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  Inject,
  inject,
  OnInit,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatDialogModule, MAT_DIALOG_DATA } from "@angular/material/dialog";
import {
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";

@Component({
  selector: "app-bid-modal",
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  template: `
  <div class="container">
    <h1 mat-dialog-title>Bid</h1>
    <div mat-dialog-content>
      <mat-form-field>
        <mat-label>Bid value</mat-label>
        <input cdkFocusInitial type="number" matInput step="0.01" [min]="minBidPriceAllowed" [formControl]="price" />
        <mat-error *ngIf="price.hasError('required')"><small>Required field</small></mat-error>
        <mat-error *ngIf="price.hasError('min')"><small>Minimal value: {{minBidPriceAllowed}}</small></mat-error>
      </mat-form-field>
    </div>
    <div mat-dialog-actions>
      <button mat-raised-button [disabled]="price.invalid" [mat-dialog-close]="price.value">Bid!</button>
    </div>
  </div>
  `,
  styles: [`.container{
    display: flex;
    flex-direction: column;
    align-items: center;
  }`],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BidModalComponent  {
  data: { idItem: number; price: number } = inject(MAT_DIALOG_DATA);
  minBidPriceAllowed = Math.round((this.data.price+0.01)*100) / 100
  price = new FormControl<number>(this.minBidPriceAllowed, {
    nonNullable: true,
    validators: [
      Validators.required,
      Validators.min(this.minBidPriceAllowed),
    ],
  });
}
