import { inject, Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, of, throwError} from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ErrorHandlerService } from 'src/app/core/util/error-handler.service';
import { Router } from '@angular/router';

@Injectable()
export class HttpErrorsInterceptor implements HttpInterceptor {
  private errorMessage = inject(ErrorHandlerService)
  private router = inject(Router)
  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError( (err: HttpErrorResponse) => {
        if(err.status ===  401){
          this.errorMessage.showError('Access denied')
          this.router.navigate(['/home'])
        }
        if(err.status === 500){
          this.errorMessage.showError('Unknow error. Sorry for problem')
        }
        return throwError(err)
      })
    )
  }
}
