import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { enableProdMode, importProvidersFrom, LOCALE_ID } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { PreloadAllModules, provideRouter, withInMemoryScrolling, withPreloading, withRouterConfig } from '@angular/router';
import { routes } from './app/app-routing';
import { AppComponent } from './app/app.component';
import { environment } from './environments/environment';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatLuxonDateModule, MAT_LUXON_DATE_ADAPTER_OPTIONS } from '@angular/material-luxon-adapter';
import { HttpErrorsInterceptor } from './app/shared/interceptors/http-errors.interceptor';
import { MatDialogModule } from '@angular/material/dialog';
import { DATE_PIPE_DEFAULT_OPTIONS } from '@angular/common';


bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom([HttpClientModule, MatSnackBarModule, BrowserAnimationsModule, MatLuxonDateModule, MatDialogModule]),
    provideRouter(routes, withRouterConfig({onSameUrlNavigation: 'reload'}), withInMemoryScrolling({scrollPositionRestoration: 'enabled'})),
    {provide: MAT_LUXON_DATE_ADAPTER_OPTIONS, useValue: {useUtc: true}},
    {provide: DATE_PIPE_DEFAULT_OPTIONS, useValue: {dateFormat: 'dd.MM.yyyy HH:mm:ss'}},
    {provide: HTTP_INTERCEPTORS, useClass: HttpErrorsInterceptor, multi: true},
  ]
})
if (environment.production) {
  enableProdMode();
}