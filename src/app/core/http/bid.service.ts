import { AuthService } from '../auth/auth.service';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ErrorHandlerService } from '../util/error-handler.service';
import { of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BidService {
  private readonly baseUrl: string = environment.url + '/bids';
  private http = inject(HttpClient)
  private authService = inject(AuthService)
  private errorHandler = inject(ErrorHandlerService)

  bid(idItem: number, bidPrice: number){
    const headers = new HttpHeaders({Authorization: 'JWT' + this.authService.getToken()})
    return this.http.post(this.baseUrl, {id_item: idItem, bid_price: bidPrice}, {headers: headers}).pipe(
      catchError( (err: HttpErrorResponse) => {
        if(err.status === 400){
          this.errorHandler.showError(err.error.message)
        }
        if(err.status === 422){
          this.errorHandler.showError('Issue with bidding of item. Probably item doesn\'t exists,you bidded it already, or it\'s price is different. Try it again later')
        }
        return of(null);
      })
    )
  }

}
