import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatDialogModule, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { Observable } from "rxjs";
import { Category } from "src/app/shared/interfaces/category/category";
import { MatSelectModule } from "@angular/material/select";
import { DateTime } from "luxon";
import { MatButtonModule } from "@angular/material/button";
import { MatListModule } from "@angular/material/list";
import { MatIconModule } from "@angular/material/icon";

@Component({
  selector: "app-create-auction-modal",
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatListModule,
    MatButtonModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatSelectModule,
  ],
  template: `
    <h1 mat-dialog-title>Create</h1>
    <div mat-dialog-content>
      <form [formGroup]="newAuctionForm">
        <mat-form-field>
          <mat-label>Name</mat-label>
          <input matInput formControlName="name" />
          <mat-error *ngIf="name?.hasError('required')"
            ><small>Required field</small></mat-error
          >
          <mat-error *ngIf="name?.hasError('maxLength')"
            ><small>Max. 250 characters</small></mat-error
          >
        </mat-form-field>
        <mat-form-field>
          <mat-label>Description</mat-label>
          <textarea matInput formControlName="description"></textarea>
          <mat-error *ngIf="description?.hasError('required')"
            ><small>Required field</small></mat-error
          >
          <mat-error *ngIf="description?.hasError('maxLength')"
            ><small>Max. 500 characters</small></mat-error
          >
        </mat-form-field>
        <mat-form-field>
          <mat-label>Category</mat-label>
          <mat-select formControlName="category">
            <mat-option>None</mat-option>
            <mat-option
              [value]="category.id_category"
              *ngFor="let category of data.categories"
              >{{ category.name }}</mat-option
            >
            <mat-error *ngIf="category?.hasError('required')"
              ><small>Required field</small></mat-error
            >
          </mat-select>
        </mat-form-field>
        <mat-form-field>
          <mat-label>Starting price</mat-label>
          <input
            type="number"
            step="0.01"
            matInput
            formControlName="startingPrice"
          />
          <mat-error *ngIf="startingPrice?.hasError('required')"
            ><small>Required field</small></mat-error
          >
          <mat-error *ngIf="startingPrice?.hasError('min')"
            ><small>Min. 0.01 zł</small></mat-error
          >
        </mat-form-field>
        <mat-form-field>
          <mat-label>End of auction</mat-label>
          <mat-datepicker #datepicker></mat-datepicker>
          <mat-datepicker-toggle
            matIconSuffix
            [for]="datepicker"
          ></mat-datepicker-toggle>
          <input
            matInput
            [min]="today"
            [matDatepicker]="datepicker"
            formControlName="endingTime"
          />
          <mat-error *ngIf="endingTime?.hasError('required')"
            ><small>Required field</small></mat-error
          >
        </mat-form-field>
        <div class="files-upload">
          <input
            type="file"
            multiple
            class="file-input"
            accept="image/*"
            maxlength="4"
            (change)="onImagesChange($event)"
            #fileUpload
          />
          <div class="file-upload">
            <ng-container>Upload images</ng-container>
            <button
              mat-mini-fab
              color="primary"
              class="upload-btn"
              (click)="fileUpload.click()"
            >
              <mat-icon>attach_file</mat-icon>
            </button>
            <small>Png, jpg or gif files only, max. 2MB</small>
            <small>Max. 4 images</small>
          </div>
        </div>
        <mat-list class="files-list" *ngIf="images.length > 0">
          <div mat-list-item *ngFor="let i of images">
            <span>{{ i.name }}</span
            ><button (click)="remove(i)" mat-icon-button>
              <mat-icon>remove</mat-icon>
            </button>
          </div>
        </mat-list>
        <button
          mat-stroked-button
          [disabled]="newAuctionForm.invalid"
          [mat-dialog-close]="{ data: newAuctionForm.value, images: images }"
        >
          Create!
        </button>
      </form>
    </div>
  `,
  styles: [
    `
      form {
        display: flex;
        flex-direction: column;
        gap: 5px;
      }
    `,
    `
      .file-upload {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 5px;
      }
    `,
    `
      .file-input {
        display: none;
      }
    `,
    `
      .files-list {
        div {
          display: flex;
          gap: 5px;
          align-items: center;
          span {
            word-break: break-all;
          }
        }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateAuctionModalComponent {
  public data: { categories: Category[] } = inject(MAT_DIALOG_DATA);
  private fb = inject(FormBuilder);
  newAuctionForm = this.fb.nonNullable.group({
    name: ["", [Validators.required, Validators.maxLength(100)]],
    description: ["", [Validators.required, Validators.maxLength(500)]],
    category: ["", Validators.required],
    startingPrice: [0.01, [Validators.required, Validators.min(0.01)]],
    endingTime: ["", Validators.required],
  });
  images: File[] = [];
  today = DateTime.now();
  get name() {
    return this.newAuctionForm.get("name");
  }
  get description() {
    return this.newAuctionForm.get("description");
  }
  get category() {
    return this.newAuctionForm.get("category");
  }
  get startingPrice() {
    return this.newAuctionForm.get("startingPrice");
  }
  get endingTime() {
    return this.newAuctionForm.get("endingTime");
  }

  remove(image: File) {
    this.images = this.images.filter((i) => i !== image);
  }
  onImagesChange(event: any) {
    let files: File[] = [];
    Array.from(event.target.files as FileList).forEach((f: File) => {
      if (files.length < 4 && f.size <= 2000000) files = [...files, f];
    });
    this.images = files;
  }
}
