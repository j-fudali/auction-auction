import { inject, Injectable } from "@angular/core";
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from "@angular/common/http";
import { Observable, of, throwError } from "rxjs";
import { catchError, switchMap } from "rxjs/operators";
import { ErrorHandlerService } from "src/app/core/util/error-handler.service";
import { Router } from "@angular/router";
import { AuthService } from "src/app/core/auth/auth.service";
import { UserService } from "src/app/core/http/user.service";

@Injectable()
export class HttpErrorsInterceptor implements HttpInterceptor {
  private errorMessage = inject(ErrorHandlerService);
  private router = inject(Router);
  private authService = inject(AuthService);
  private userService = inject(UserService);
  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((err: HttpErrorResponse) => {
        if (err.status === 401) {
          const refreshToken = this.authService.getRefreshToken();
          if (refreshToken) {
            return this.userService.refreshAccessToken(refreshToken).pipe(
              switchMap(({ token, refresh_token }) => {
                this.authService.setToken(token);
                this.authService.setRefreshToken(refresh_token);
                request = request.clone({
                  setHeaders: {
                    Authorization: `JWT ${token}`,
                  },
                });
                return next.handle(request);
              }),
              catchError((err: HttpErrorResponse) => {
                if (!this.router.url.includes("/products")) {
                  this.errorMessage.showError("Access denied");
                  this.router.navigate(["/home"]);
                }
                return throwError(err);
              })
            );
          } else {
            this.errorMessage.showError("Access denied");
            this.router.navigate(["/home"]);
          }
        }
        if (err.status === 500) {
          this.errorMessage.showError("Unknow error. Sorry for problem");
        }
        return throwError(err);
      })
    );
  }
}
