import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { FormServiceService } from 'src/app/services/form-service.service';
import { Country } from 'src/app/common/country';
import { State } from 'src/app/common/state';
import { FormValidators } from 'src/app/validators/form-validators';
import { CartService } from 'src/app/services/cart.service';
import { CheckoutService } from 'src/app/services/checkout.service';
import { Router } from '@angular/router';
import { Order } from 'src/app/common/order';
import { OrderItem } from 'src/app/common/order-item';
import { Purchase } from 'src/app/common/purchase';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  checkoutForm : FormGroup;
  totalPrice : number = 0;
  totalQuantity : number = 0;
  
  creditCardYears : number[] = [];
  creditCardMonths : number[] = [];
  countries : Country[] = [];
  
  shippingAddressState : State[] = [];
  billingAddressState : State[] = [];

  constructor(private formBuilder : FormBuilder, private formService : FormServiceService,private cartService : CartService,
                private checkoutService : CheckoutService,private router : Router) { }

  ngOnInit(): void {
    this.checkoutForm = this.formBuilder.group({
      customer : this.formBuilder.group({
        firstName : new FormControl('' , [Validators.required,Validators.minLength(2),FormValidators.notOnlyWhitespace]),
        lastName : new FormControl('' , [Validators.required,Validators.minLength(2),FormValidators.notOnlyWhitespace]),
        email : new FormControl('' , [Validators.required,Validators.minLength(2),
              Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')])
      }),
      shippingAddress : this.formBuilder.group({
        street : new FormControl('' , [Validators.required,Validators.minLength(2),FormValidators.notOnlyWhitespace]),
        city : new FormControl('' , [Validators.required,Validators.minLength(2),FormValidators.notOnlyWhitespace]),
        state : new FormControl('' , [Validators.required]),
        country : new FormControl('' , [Validators.required]),
        zipCode : new FormControl('' , [Validators.required,Validators.minLength(2),FormValidators.notOnlyWhitespace])
      }),
      billingAddress : this.formBuilder.group({
        street : new FormControl('' , [Validators.required,Validators.minLength(2)]),
        city : new FormControl('' , [Validators.required,Validators.minLength(2)]),
        state : new FormControl('' , [Validators.required,Validators.minLength(2)]),
        country : new FormControl('' , [Validators.required,Validators.minLength(2)]),
        zipCode : new FormControl('' , [Validators.required,Validators.minLength(2)])
      }),
      creditCard : this.formBuilder.group({
        cardType : new FormControl('' , [Validators.required,Validators.minLength(2)]),
        nameOnCard : new FormControl('' , [Validators.required,Validators.minLength(2),
                                              FormValidators.notOnlyWhitespace]),
        cardNumber : new FormControl('' , [Validators.required,Validators.pattern('[0-9]{16}')]),
        securityCode : new FormControl('' , [Validators.required,Validators.pattern('[0-9]{3}')]),
        expirationMonth : [''],
        expirationYear : ['']
      })
    });

    //populate creadit card months
    const startMonth : number =  new Date().getMonth() + 1; //0 based so add 1
    console.log("Start month:" + startMonth);
    this.formService.getCreditCardMonths(startMonth).subscribe(
      data => {
        console.log("Retrieved month details : " + JSON.stringify(data));
        this.creditCardMonths = data;
      }
    )

    //populate credit card years
    this.formService.getCreditCardYears().subscribe(
      data => {
        console.log("Year : " + JSON.stringify(data));
        this.creditCardYears = data
      }
    )

    //populate countries
    this.formService.getCountries()
    .subscribe((res : Country[])=>{
        console.log(res);
        this.countries = res;
    });

    this.reviewCartDetails();
  }


  get firstName(){ return this.checkoutForm.get('customer.firstName'); }
  get lastName(){ return this.checkoutForm.get('customer.lastName'); }
  get email(){ return this.checkoutForm.get('customer.email'); }

  get shippingAddressstreet(){ return this.checkoutForm.get('shippingAddress.street'); }
  get shippingAddresscity(){ return this.checkoutForm.get('shippingAddress.city'); }
  get shippingAddressstate(){ return this.checkoutForm.get('shippingAddress.state'); }
  get shippingAddresscountry(){ return this.checkoutForm.get('shippingAddress.country'); }
  get shippingAddresszipcode(){ return this.checkoutForm.get('shippingAddress.zipCode'); }

  get billingAddressstreet(){ return this.checkoutForm.get('billingAddress.street'); }
  get billingAddressscity(){ return this.checkoutForm.get('billingAddress.city'); }
  get billingAddressstate(){ return this.checkoutForm.get('billingAddress.state'); }
  get billingAddresscountry(){ return this.checkoutForm.get('billingAddress.country'); }
  get billingAddresszipcode(){ return this.checkoutForm.get('billingAddress.zipCode'); }

  get creditCardType(){ return this.checkoutForm.get('creditCard.cardType'); }
  get creditCardHolder(){ return this.checkoutForm.get('creditCard.nameOnCard'); }
  get creditCardNumber(){ return this.checkoutForm.get('creditCard.cardNumber'); }
  get creditCardCvv(){ return this.checkoutForm.get('creditCard.securityCode'); }
  
  
  copySAddrtoBAddr(event){
    if(event.target.checked){
      this.checkoutForm.controls.billingAddress
        .setValue(this.checkoutForm.controls.shippingAddress.value);

      //Copy bug fix states
      this.billingAddressState = this.shippingAddressState;
    }
    else {
      this.checkoutForm.controls.billingAddress.reset();

      //Copy bug fix states
      this.billingAddressState = [];
    }
  }

  

  handleMonthAndYears(){
    const creditCardFormGroup = this.checkoutForm.get('creditCard');
    const currentYear : number = new Date().getFullYear();
    const selectedYear : number = Number(creditCardFormGroup.value.expirationYear);
    let month : number;

    if(currentYear === selectedYear){
      month = new Date().getMonth() + 1;
    }
    else {
      month = 1;
    }

    this.formService.getCreditCardMonths(month).subscribe(
      data => {
        this.creditCardMonths = data;
      }
    )
  }

  getStates(formGroupName : string){
    const formGroup = this.checkoutForm.get(formGroupName);
    const countryCode = formGroup.value.country.code;
    const countryName = formGroup.value.country.name;

    this.formService.getStatesByCcode(countryCode)
      .subscribe(
        (data : State[]) => {
          if( formGroupName === 'shippingAddress') {
            this.shippingAddressState = data;
          }
          else {
            this.billingAddressState = data;
          }

          formGroup.get('state').setValue(data[0]);
        }
      )
  }

  reviewCartDetails(){
    //subscribe to cartservice - totalQuantity and total Price
    this.cartService.totalQuantity.subscribe(totalQuantity => {
      this.totalQuantity = totalQuantity;
    });

    this.cartService.totalPrice.subscribe(totalPrice => {
      this.totalPrice = totalPrice;
    });
  }

  resetCart(){
    //reset cart data
    this.cartService.cartItems = [];
    this.cartService.totalPrice.next(0);
    this.cartService.totalQuantity.next(0);

    //reset form data
    this.checkoutForm.reset();

    //navigate back to products page
    this.router.navigateByUrl("/products")
  }

  onSubmit(){

    if(this.checkoutForm.invalid){
      // markAllAsTouched - triggers display of error messages
      this.checkoutForm.markAllAsTouched();   
      return;   
    }
    console.log(this.checkoutForm.get('customer').value);
    console.log("Email address is: ", this.checkoutForm.get('customer').value.email);
    console.log("Shipping Address country is ",this.checkoutForm.get('shippingAddress').value.country.name);
    console.log("Shipping Address state is ",this.checkoutForm.get('shippingAddress').value.state.name);
    console.log("Billing Address country is ",this.checkoutForm.get('billingAddress').value.country.name);

    //set up order
    let order = new Order();
    order.totalQuantity = this.totalQuantity;
    order.totalPrice = this.totalPrice;

    //get cart items
    const cartItems =  this.cartService.cartItems;

    //create orderItems from cartItems

    //long way
    /*
    let orderItems : OrderItem[] = [];
    for(let i=0;i < cartItems.length; i++){
      orderItems[i] = new OrderItem(cartItems[i]);
    }
    */

    //short way
    let orderItems : OrderItem[] = cartItems.map(tempCartItem => new OrderItem(tempCartItem));

    //set up purchase
    let purchase = new Purchase();

    //populate purchase - customer
    purchase.customer = this.checkoutForm.controls['customer'].value;


    //populate purchase - shipping address
    purchase.shippingAddress = this.checkoutForm.controls['shippingAddress'].value;
    const shippingState : State = JSON.parse(JSON.stringify(purchase.shippingAddress.state));
    const shippingCountry : Country = JSON.parse(JSON.stringify(purchase.shippingAddress.country));
    purchase.shippingAddress.state = shippingState.name;
    purchase.shippingAddress.country = shippingCountry.name;

    //populate purchase - billing address
    purchase.billingAddress = this.checkoutForm.controls['billingAddress'].value;
    const billingState : State = JSON.parse(JSON.stringify(purchase.billingAddress.state));
    const billingCountry : Country = JSON.parse(JSON.stringify(purchase.billingAddress.country));
    purchase.billingAddress.state = billingState.name;
    purchase.billingAddress.country = billingCountry.name;

    //populate purchase - order and orderItems
    purchase.order = order;
    purchase.orderItems = orderItems;

    console.log(purchase);

    //call REST Api via checkout service

    //next - sucsess 
    //error - exception
    this.checkoutService.placeOrder(purchase).subscribe({
      next : response => {
        alert(`Your order has been received. \nOrder Tracking number : ${response.orderTrackingNumber}`);

        //reset cart
        this.resetCart();
      },
      error : err => {
        alert(`There was an error : ${err.message}`);
        
      }
    })
  }

}
