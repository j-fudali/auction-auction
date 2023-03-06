import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})

export class ErrorHandlerService {
  private snackbarService: MatSnackBar = inject(MatSnackBar)

  showError(notification: string){
    this.snackbarService.open(notification, 'X', {duration: 10000});
  }
}
