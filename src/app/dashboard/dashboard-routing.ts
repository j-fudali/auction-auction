import { Route } from "@angular/router";
import { DashboardComponent } from "./dashboard.component";
import { ProductViewComponent } from "./pages/product-view/product-view.component";
import { ProductsComponent } from "./pages/products/products.component";

export default [
    {path: '', component: DashboardComponent, children: [
        {path: 'products', component: ProductsComponent},
        {path: 'product/:id', component: ProductViewComponent},
        {path: '', redirectTo: 'products', pathMatch: 'full'}
    ]}
] as Route[]