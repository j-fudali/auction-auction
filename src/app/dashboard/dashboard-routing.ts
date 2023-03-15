import { inject } from "@angular/core";
import { ActivatedRoute, ActivatedRouteSnapshot, Route, Router } from "@angular/router";
import { map, switchMap, tap } from "rxjs/operators";
import { AuthService } from "../core/auth/auth.service";
import { ItemsService } from "../core/http/items.service";
import { UserService } from "../core/http/user.service";
import { DashboardComponent } from "./dashboard.component";
import { ProductViewComponent } from "./pages/product-view/product-view.component";
import { ProductsComponent } from "./pages/products/products.component";
const dashboardGuard = () => {
    const isAuth = inject(AuthService).isAuthenticated()
    const router = inject(Router)
    return !isAuth ? router.navigate(['/home/login']) : true;
  }
const productsListResolver = () => {
    const itemsService = inject(ItemsService)
    return itemsService.getItems()
}
const productResolver = (route: ActivatedRouteSnapshot) => {
    const itemsService = inject(ItemsService)
    return itemsService.getItemById(+route.paramMap.get('id')!)
}
const userIdResolver = () => {
    const authService = inject(AuthService)
    const userService = inject(UserService)
    if(authService.isAuthenticated()){
        return userService.getUserCredentials().pipe(map( v => v.id_user))
    }
    return null
}
export default [
    {path: '', component: DashboardComponent, children: [
        {path: 'products', component: ProductsComponent, resolve: {products: productsListResolver, userId: userIdResolver}},
        {path: 'products/:id', component: ProductViewComponent, resolve: {product: productResolver, userId: userIdResolver}},
        {path: 'profile', component: ProductViewComponent, canActivate: [dashboardGuard]},
        {path: '', redirectTo: 'products', pathMatch: 'full'}
    ]}
] as Route[]