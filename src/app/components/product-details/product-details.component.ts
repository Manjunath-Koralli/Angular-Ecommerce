import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/services/product.service';
import { ActivatedRoute } from '@angular/router';
import { Product } from 'src/app/common/product';
import { CartService } from 'src/app/services/cart.service';
import { CartItem } from 'src/app/common/cart-item';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {

  product: Product = new Product();
  constructor(private productService: ProductService, private route: ActivatedRoute, 
              private cartService: CartService) { }

  ngOnInit() {
    this.route.paramMap.subscribe( () => {
      this.productDetail();
    })
  }
  productDetail() {
    // "+" - converts it into integer => +this.route.snapshot.paramMap.get('id');
    const productId = +this.route.snapshot.paramMap.get('id');
    this.productService.getProductDetail(productId)
        .subscribe((res : Product)=>{
          console.log(res);
          this.product = res;
        });
  }

  addToCart(){
    console.log(`Adding to product: ${this.product.name}`);
    const cartItem = new CartItem(this.product);
    this.cartService.addToCart(cartItem);
  }

}

//Since product was not assigned it gives error for imageUrl - race condition 
//because value fro imageURl is not yet assigned
//so we should instantitate Product object
//1 solun--- product : Product = new Product() in ts file
//or
//<img src = "{{ product?.imageUrl }}" class="detail-img">