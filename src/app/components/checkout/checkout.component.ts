import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { FormServiceService } from 'src/app/services/form-service.service';

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

  constructor(private formBuilder : FormBuilder, private formService : FormServiceService) { }

  ngOnInit(): void {
    this.checkoutForm = this.formBuilder.group({
      customer : this.formBuilder.group({
        firstName : [''],
        lastName : [''],
        email : ['']
      }),
      shippingAddress : this.formBuilder.group({
        street : [''],
        city : [''],
        state : [''],
        country : [''],
        zipCode : ['']
      }),
      billingAddress : this.formBuilder.group({
        street : [''],
        city : [''],
        state : [''],
        country : [''],
        zipCode : ['']
      }),
      creditCard : this.formBuilder.group({
        cardType : [''],
        nameOnCard : [''],
        cardNumber : [''],
        securityCode : [''],
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
  }

  copySAddrtoBAddr(event){
    if(event.target.checked){
      this.checkoutForm.controls.billingAddress
        .setValue(this.checkoutForm.controls.shippingAddress.value);
    }
    else {
      this.checkoutForm.controls.billingAddress.reset();
    }
  }

  onSubmit(){
    console.log(this.checkoutForm.get('Customer').value);
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

}
