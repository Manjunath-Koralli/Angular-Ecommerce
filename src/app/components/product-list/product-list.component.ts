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
  searchMode : boolean;
  currentCategoryId : number;
  
  constructor(private productService: ProductService, private route: ActivatedRoute) { }

  ngOnInit() {
    //this.getAllProducts();
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
    this.searchMode = this.route.snapshot.paramMap.has('keyword');
    if(this.searchMode){
      this.handleSearchProducts();
    }else {
      this.handleListProducts();
    }
    

  }

  handleSearchProducts(){
    const haskeyWord : boolean = this.route.snapshot.paramMap.has('keyword');
    console.log(haskeyWord);
    if(haskeyWord){
      const keyword : string = this.route.snapshot.paramMap.get('keyword');
      this.productService.getProductsByKey(keyword)
        .subscribe((res : Product[]) => {
          //console.log(res);
          this.products = res;
        })
    }
    else {
      this.getAllProducts();
    }
    
    

  }


  handleListProducts(){

    //check if "id" is available - returns true or false
    const hasCategoryId : boolean = this.route.snapshot.paramMap.has('id');
    //console.log(hasCategoryId);
    if(hasCategoryId){
      // "+" - converts it into integer => +this.route.snapshot.paramMap.get('id');
      this.currentCategoryId = +this.route.snapshot.paramMap.get('id');
      console.log(this.currentCategoryId);
      this.productService.getProductsByCat(this.currentCategoryId)
        .subscribe((res : Product[])=>{
          //console.log(res);
          this.products = res;
        });
    }
    else {
      this.getAllProducts();
    }
    

  }

  addToCart(product : Product){

  }

}

// ActivatedRoute - for accessing route parameters