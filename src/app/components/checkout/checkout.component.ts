import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { FormServiceService } from 'src/app/services/form-service.service';
import { Country } from 'src/app/common/country';
import { State } from 'src/app/common/state';
import { FormValidators } from 'src/app/validators/form-validators';

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
    if(this.checkoutForm.invalid){
      // markAllAsTouched - triggers display of error messages
      this.checkoutForm.markAllAsTouched();      
    }
    console.log(this.checkoutForm.get('customer').value);
    console.log("Email address is: ", this.checkoutForm.get('customer').value.email);
    console.log("Shipping Address country is ",this.checkoutForm.get('shippingAddress').value.country.name);
    console.log("Shipping Address state is ",this.checkoutForm.get('shippingAddress').value.state.name);
    console.log("Billing Address country is ",this.checkoutForm.get('billingAddress').value.country.name);
  }

}
