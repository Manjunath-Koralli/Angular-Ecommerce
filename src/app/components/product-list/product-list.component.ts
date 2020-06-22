import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/services/product.service';
import { Product } from 'src/app/common/product';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-product-list',
  //templateUrl: './product-list.component.html',
  templateUrl: './product-list-grid.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  products: Product[];
  currentCategoryId : number;
  constructor(private productService: ProductService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.getAllProducts();
    this.route.paramMap.subscribe( () => {
      this.productList();
    })
    
  }

  getAllProducts() {
    this.productService.getProducts()
      .subscribe((res : Product[])=>{
        console.log(res);

        this.products = res;
    });
  }
  productList() {
    
    //check if "id" is available - returns true or false
    const hasCategoryId : boolean = this.route.snapshot.paramMap.has('id');
    console.log(hasCategoryId);
    if(hasCategoryId){
      // "+" - converts it into integer => +this.route.snapshot.paramMap.get('id');
      this.currentCategoryId = +this.route.snapshot.paramMap.get('id');
    }
    else {
      this.currentCategoryId = 1;
    }
    console.log(this.currentCategoryId);
    this.productService.getProductsByCat(this.currentCategoryId)
      .subscribe((res : Product[])=>{
        console.log(res);

        this.products = res;
    });
    
  }

}

// ActivatedRoute - for accessing route parameters