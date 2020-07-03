import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProductListComponent } from './components/product-list/product-list.component';
import { SearchComponent } from './components/search/search.component';


const routes: Routes = [
  { path:'products/search/:keyword', component: SearchComponent},
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
