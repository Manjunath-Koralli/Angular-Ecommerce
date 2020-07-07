import { Injectable } from '@angular/core';
import { CartItem } from '../common/cart-item';
import { Subject } from 'rxjs';
import { CompileShallowModuleMetadata } from '@angular/compiler';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  cartItems : CartItem[] = [];

  //Subject is a subclass of Observable
  //to publish events in code
  //event will be sent to all subscribers

  totalPrice : Subject<number> = new Subject<number>();
  totalQuantity : Subject<number> = new Subject<number>();
  
  constructor() { }


  addToCart(cartItem : CartItem){

    //check if we already have item in our cart
    let alreadyExistsInCart : boolean = false;
    let existingCartItem : CartItem = undefined;

    
    if(this.cartItems.length > 0){
      //find the item in cart based on item id

      for(let tempCartItem of this.cartItems){
        if(tempCartItem.id === cartItem.id){
          existingCartItem = tempCartItem;
          break;
        }
      }
      //check if we found it
      alreadyExistsInCart = (existingCartItem != undefined);
    }
    
    if(alreadyExistsInCart){
      //increment quantity
      existingCartItem.quantity++ ;
    }
    else {
      //add the item to array
      this.cartItems.push(cartItem);
    }
      //compute cart total price and total quantity
      this.computeCartTotals()
  }

  computeCartTotals() {
    let totalPriceValue : number = 0;
    let totalQuantityValue : number = 0;

    for(let currentItems of this.cartItems){
      totalPriceValue += currentItems.quantity * currentItems.unitPrice;
      totalQuantityValue += currentItems.quantity;
    }

    //publish the new values...all subscribers will receive the new data
    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalQuantityValue);

    this.logCartData(totalPriceValue,totalQuantityValue);

  }

  logCartData(totalPriceValue: number, totalQuantityValue: number) {
    console.log("Contents of cart");
    for(let tempCartItem of this.cartItems){
      const subTotalPrice = tempCartItem.quantity * tempCartItem.unitPrice;
      console.log(`name: ${tempCartItem.name}, quantity: ${tempCartItem.quantity}, 
        unitprice: ${tempCartItem.unitPrice}, subTotalPrice: ${subTotalPrice}`);
    }

    console.log(`total price: ${totalPriceValue.toFixed(2)}, total quantity: ${totalQuantityValue}`);
    console.log("---");

  }
}
