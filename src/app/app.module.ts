import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ProductService } from './services/product.service';
import { ProductCategoryMenuComponent } from './components/product-category-menu/product-category-menu.component';
import { SearchComponent } from './components/search/search.component';
import { ProductDetailsComponent } from './components/product-details/product-details.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CartStatusComponent } from './components/cart-status/cart-status.component';
import { CartDetailsComponent } from './components/cart-details/cart-details.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './components/login/login.component';
import { LoginStausComponent } from './components/login-staus/login-staus.component';
import myAppConfig from './config/my-app-config';
import { Router, RouterModule, Routes } from '@angular/router';

import {
  OKTA_CONFIG,
  OktaAuthModule,
  OktaCallbackComponent,
  OktaAuthGuard
} from '@okta/okta-angular';
import { MemberPageComponent } from './components/member-page/member-page.component';
import { OrderHistoryComponent } from './components/order-history/order-history.component';
import { AuthInterceptorService } from './services/auth-interceptor.service';

const okta_config = Object.assign({
  onAuthRequired : (oktaAuth , injector) => {
    const router = injector.get(Router);
    router.navigate(['/login']);
  }
}, myAppConfig.oidc);

const routes: Routes = [
  { path : 'members', component : MemberPageComponent, canActivate : [ OktaAuthGuard ]},
  { path : 'order-history', component: OrderHistoryComponent, canActivate : [ OktaAuthGuard ]},

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
  declarations: [
    AppComponent,
    ProductListComponent,
    ProductCategoryMenuComponent,
    SearchComponent,
    ProductDetailsComponent,
    CartStatusComponent,
    CartDetailsComponent,
    CheckoutComponent,
    LoginComponent,
    LoginStausComponent,
    MemberPageComponent,
    OrderHistoryComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    NgbModule,
    OktaAuthModule,
    RouterModule.forRoot(routes)
  ],
  providers: [ProductService, { provide: OKTA_CONFIG, useValue : okta_config},
          { provide: HTTP_INTERCEPTORS, useClass : AuthInterceptorService, multi : true}],
  bootstrap: [AppComponent]
})
export class AppModule { }
