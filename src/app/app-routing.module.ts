import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProductListComponent } from './components/product-list/product-list.component';
import { SearchComponent } from './components/search/search.component';
import { ProductDetailsComponent } from './components/product-details/product-details.component';
import { CartDetailsComponent } from './components/cart-details/cart-details.component';
import { CheckoutComponent } from './components/checkout/checkout.component';


const routes: Routes = [
  { path:'checkout', component: CheckoutComponent},
  { path:'cart-details', component: CartDetailsComponent},
  { path:'products/:id', component: ProductDetailsComponent},
  { path:'products/search/:keyword', component: ProductListComponent},
  { path:'category/:id', component: ProductListComponent},
  { path:'category', component: ProductListComponent},
  { path:'products', component: ProductListComponent},
  { path:'', redirectTo:'/products', pathMatch:'full'},
  { path:'**', redirectTo:'/products', pathMatch:'full'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
