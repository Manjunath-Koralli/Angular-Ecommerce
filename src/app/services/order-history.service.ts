import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderHistoryService {

  private orderbaseUrl = "http://localhost:8088/api/orders";

  constructor(private httpClient : HttpClient) { }

  getOrderHistory(userEmail : String) {
    const orderHistoryUrl = `${this.orderbaseUrl}/search/findCustomerByEmailService?email=${userEmail}`;
    return this.httpClient.get(orderHistoryUrl);
  }
}
