import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { FormServiceService } from 'src/app/services/form-service.service';
import { Country } from 'src/app/common/country';
import { State } from 'src/app/common/state';

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

    //populate countries
    this.formService.getCountries()
    .subscribe((res : Country[])=>{
        console.log(res);
        this.countries = res;
    })
  }

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

  onSubmit(){
    console.log(this.checkoutForm.get('Customer').value);
  }

}
