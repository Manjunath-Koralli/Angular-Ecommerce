import { Component, OnInit } from '@angular/core';
import { ProductCategory } from 'src/app/common/product-category';
import { ProductCategoryServiceService } from 'src/app/services/product-category-service.service';

@Component({
  selector: 'app-product-category-menu',
  templateUrl: './product-category-menu.component.html',
  styleUrls: ['./product-category-menu.component.css']
})
export class ProductCategoryMenuComponent implements OnInit {

  prodcutCategories : ProductCategory[];
  constructor(private productCatService: ProductCategoryServiceService) { }

  ngOnInit(): void {
    this.getAllProductCategories();
  }

  getAllProductCategories(){
    this.productCatService.getProductCategories()
      .subscribe((res : ProductCategory[])=>{
        console.log(res);

        this.prodcutCategories = res;
    });
  }

}
