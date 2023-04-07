import { inject } from "@angular/core";
import { ActivatedRoute, ActivatedRouteSnapshot, Route, Router } from "@angular/router";
import { forkJoin } from "rxjs";
import { map, switchMap, tap } from "rxjs/operators";
import { AuthService } from "../core/auth/auth.service";
import { CountryService } from "../core/http/country.service";
import { DiscussionsService } from "../core/http/discussions.service";
import { ItemsService } from "../core/http/items.service";
import { ProvinceService } from "../core/http/province.service";
import { UserService } from "../core/http/user.service";
import { DashboardComponent } from "./dashboard.component";
import { DiscussionsComponent } from "./pages/discussions/discussions.component";
import { MyProductsComponent } from "./pages/my-products/my-products.component";
import { MyProfileComponent } from "./pages/my-profile/my-profile.component";
import { ProductViewComponent } from "./pages/product-view/product-view.component";
import { ProductsComponent } from "./pages/products/products.component";
const dashboardGuard = () => {
    const authService = inject(AuthService)
    const isAuth = authService.isAuthenticated()
    const refreshToken = authService.getRefreshToken()
    const router = inject(Router)
    if(!isAuth && !refreshToken){
        router.navigate(['/home/login'])
        return false
    }
    return true
  }
const productsListResolver = () => {
    const itemsService = inject(ItemsService)
    return itemsService.getItems()
}
const productResolver = (route: ActivatedRouteSnapshot) => {
    const itemsService = inject(ItemsService)
    const linkArray = route.paramMap.get('id')?.split('-');
    return itemsService.getItemById(+linkArray![linkArray!.length - 1])
}
const userIdResolver = () => {
    const authService = inject(AuthService)
    const userService = inject(UserService)
    if(authService.isAuthenticated()){
        return userService.getUserCredentials().pipe(map( v => v?.id_user))
    }
    return null
}
const profileResolver = () => {
    const userService = inject(UserService)
    const provinceService = inject(ProvinceService)
    const countryService = inject(CountryService)
    return forkJoin([userService.getUserCredentials(), provinceService.getProvinces(), countryService.getCoutries()])
}
const discussionsResolver = () => {
    const discussionsService = inject(DiscussionsService)
    return discussionsService.getAllDiscussions()
}
export default [
    {path: '', component: DashboardComponent, resolve: {userId: userIdResolver}, children: [
        {path: 'products', component: ProductsComponent, resolve: {products: productsListResolver, userId: userIdResolver}},
        {path: 'products/:id', component: ProductViewComponent, resolve: {product: productResolver, userId: userIdResolver}},
        {path: 'my-profile', loadChildren: () => import('./pages/my-profile/my-profile-routing'), canActivate: [dashboardGuard], resolve: {profileData: profileResolver}},
        {path: 'my-products', component: MyProductsComponent, canActivate: [dashboardGuard]},
        {path: 'discussions', component: DiscussionsComponent, canActivate: [dashboardGuard], resolve: {discussions: discussionsResolver, userId: userIdResolver}},
        {path: '', redirectTo: 'products', pathMatch: 'full'}
    ]}
] as Route[]