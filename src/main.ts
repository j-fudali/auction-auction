import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { enableProdMode, importProvidersFrom } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { routes } from './app/app-routing';
import { AppComponent } from './app/app.component';
import { environment } from './environments/environment';
import { provideAnimations, BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatLuxonDateModule, MAT_LUXON_DATE_ADAPTER_OPTIONS } from '@angular/material-luxon-adapter';
import { HttpErrorsInterceptor } from './app/shared/interceptors/http-errors.interceptor';


bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom([HttpClientModule, MatSnackBarModule, BrowserAnimationsModule, MatLuxonDateModule]),
    provideRouter(routes),
    {provide: MAT_LUXON_DATE_ADAPTER_OPTIONS, useValue: {useUtc: true}},
    {provide: HTTP_INTERCEPTORS, useClass: HttpErrorsInterceptor, multi: true}
  ]
})
if (environment.production) {
  enableProdMode();
}