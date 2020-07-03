import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product } from '../common/product';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private baseUrl = "http://localhost:8088/products";
  

  constructor(private http: HttpClient) { 

  }

  //All Products
  getProducts(){
    return this.http.get(this.baseUrl);
  }

  //Products By Category Id
  getProductsByCat(categoryId : number){
    //this.baseUrl+"/category/"+categoryId;
    const getCategoryByIdUrl = "http://localhost:8088/category/"+categoryId;
    return this.http.get(getCategoryByIdUrl);
  }
}

  


