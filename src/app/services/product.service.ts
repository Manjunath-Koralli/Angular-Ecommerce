import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product } from '../common/product';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private getUrl = "http://localhost:8088/products";

  constructor(private http: HttpClient) { 

  }

  getProducts(){
    return this.http.get(this.getUrl);
    
  }
}

  


