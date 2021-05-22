import { Component, OnInit } from '@angular/core';
import { OrderHistory } from 'src/app/common/order-history';
import { OrderHistoryService } from 'src/app/services/order-history.service';

@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.css']
})
export class OrderHistoryComponent implements OnInit {

  orderHistoryList : OrderHistory[] = [];  
  storage : Storage = sessionStorage;

  constructor(private orderHistoryService : OrderHistoryService) { }

  ngOnInit(): void {
    this.getOrderHistoryList();
  }

  getOrderHistoryList() {
    //read email from web storage
    const userEmail = JSON.parse(this.storage.getItem('userEmail'));

    //call history service
    this.orderHistoryService.getOrderHistory(userEmail).subscribe((res : OrderHistory[]) => {
      console.log(res);
      this.orderHistoryList = res;
    });
  }

}
