import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Country } from '../common/country';

@Injectable({
  providedIn: 'root'
})
export class FormServiceService {

  private countriesUrl = "http://localhost:8088/countries";
  private statesUrl = "http://localhost:8088/states";

  constructor(private httpClient : HttpClient) { }

  getCreditCardMonths(startMonth : number) : Observable<number[]> {
    let monthData : number[] = [];

    //build an array for "month" dropdownlist
    // - start at current month and loop untill

    for(let tempMonth = startMonth; tempMonth <= 12; tempMonth++){
      monthData.push(tempMonth);
    }

    //wrapper for observable object - data
    //of - will wrap an object as an observable
    return of(monthData);
  }

  getCreditCardYears() : Observable<number[]> {
    let yearData : number[] = [];
    
    //build an array for "month" dropdownlist
    // - start at current month and loop untill

    const startYear : number = new Date().getFullYear();
    const endYear : number = startYear + 10;

    for(let tempYear = startYear; tempYear <= endYear; tempYear++){
      yearData.push(tempYear);
    }

    //wrapper an object as an  observable 
    return of(yearData);
  }

  getCountries(){
    return this.httpClient.get(this.countriesUrl);
  }

  getStatesByCcode(cCode : string){
    const getStatesByCodeUrl = `${this.statesUrl}/search/${cCode}`;
    return this.httpClient.get(getStatesByCodeUrl);
  } 


}
