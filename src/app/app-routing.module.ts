import { NgModule } from '@angular/core';
import { Routes, RouterModule, Router } from '@angular/router';
import { ProductListComponent } from './components/product-list/product-list.component';
import { SearchComponent } from './components/search/search.component';
import { ProductDetailsComponent } from './components/product-details/product-details.component';
import { CartDetailsComponent } from './components/cart-details/cart-details.component';
import { CheckoutComponent } from './components/checkout/checkout.component';

import {
  OKTA_CONFIG,
  OktaAuthModule,
  OktaCallbackComponent
} from '@okta/okta-angular';

import myAppConfig from './config/my-app-config';
import { LoginComponent } from './components/login/login.component';

const okta_config = Object.assign({
  onAuthRequired : (injector) => {
    const router = injector.get(Router);
    router.navigate(['/login']);
  }
}, myAppConfig.oidc);

const routes: Routes = [
  { path : 'login/callback', component : OktaCallbackComponent},
  { path : 'login', component : LoginComponent},

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
