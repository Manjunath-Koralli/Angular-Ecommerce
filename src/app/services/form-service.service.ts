import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class FormServiceService {

  constructor() { }

  getCreditCardMonths(startMonth : number) : Observable<number[]> {
    let monthData : number[] = [];

    //build an array for "month" dropdownlist
    // - start at current month and loop untill

    for(let tempMonth = startMonth; tempMonth <= 12; tempMonth++){
      monthData.push(tempMonth);
    }

    //wrapper for observable object - data
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


}
