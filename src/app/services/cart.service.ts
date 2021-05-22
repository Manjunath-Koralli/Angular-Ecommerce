import { Injectable } from '@angular/core';
import { CartItem } from '../common/cart-item';
import { BehaviorSubject, Subject } from 'rxjs';
import { CompileShallowModuleMetadata } from '@angular/compiler';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  

  cartItems : CartItem[] = [];

  //Subject is a subclass of Observable
  //to publish events in code
  //event will be sent to all subscribers

  totalPrice : Subject<number> = new BehaviorSubject<number>(0);
  totalQuantity : Subject<number> = new BehaviorSubject<number>(0);
  
  //Webbrowser Api Storage -  only when browser is active - if we close browser and open it again - data lost
  storage : Storage = sessionStorage;

  //if we want data even after we close and reopen again - use localStorage
  //storage : Storage = localStorage;

  constructor() { 

    // read data from storage and assign to cartItems
    let data = JSON.parse(this.storage.getItem('cartItems')); 

    if(data != null) {
      this.cartItems = data;
      this.computeCartTotals();
    }

  }

  persistCartItems(){    
    //store to webstorage api
    this.storage.setItem('cartItems', JSON.stringify(this.cartItems))
  }

  addToCart(cartItem : CartItem){

    //check if we already have item in our cart
    let alreadyExistsInCart : boolean = false;
    let existingCartItem : CartItem = undefined;

    
    if(this.cartItems.length > 0){
      //find the item in cart based on item id

      /*for(let tempCartItem of this.cartItems){
        if(tempCartItem.id === cartItem.id){
          existingCartItem = tempCartItem;
          break;
        }
      }*/

      //same logic like above
      //returns first elements that passess else returns undefined
      //temoCartItem -> curretn array element
      existingCartItem = this.cartItems.find(tempCartItem => tempCartItem.id == cartItem.id)

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

    //persist cart data
    this.persistCartItems();
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

  decrementQuantity(cartItem: CartItem) {
    cartItem.quantity--;
    if(cartItem.quantity === 0 ){
      this.remove(cartItem);
    }
    else {
      this.computeCartTotals();
    }
  }

  remove(cartItem: CartItem) {
    
    //get Index of item in array
    const itemIndex = this.cartItems.findIndex( tempCartItem => tempCartItem.id === cartItem.id );

    //if found remove item from array at given index
    if(itemIndex > -1){
      //remove 1 item
      this.cartItems.splice(itemIndex,1);
      this.computeCartTotals();
    }
  }
}
