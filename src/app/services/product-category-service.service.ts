import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProductCategoryServiceService {

  private baseUrl = "http://localhost:8088/product-category";

  constructor(private http: HttpClient) { }

  getProductCategories(){
    return this.http.get(this.baseUrl);
  }
}
