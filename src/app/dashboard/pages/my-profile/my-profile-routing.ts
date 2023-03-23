import { Route } from "@angular/router";
import { LoginHistoryComponent } from "./pages/login-history/login-history.component";
import { PasswordChangeComponent } from "./pages/password-change/password-change.component";
import { ProfilePageComponent } from "./pages/profile-page/profile-page.component";

export default [
    {path: '', component: ProfilePageComponent},
    {path: 'change-password', component: PasswordChangeComponent},
    {path: 'login-history', component: LoginHistoryComponent}
] as Route[]