import { Component, OnInit } from '@angular/core';
import { OktaAuthService } from '@okta/okta-angular';

@Component({
  selector: 'app-login-staus',
  templateUrl: './login-staus.component.html',
  styleUrls: ['./login-staus.component.css']
})
export class LoginStausComponent implements OnInit {

  isAuthenticated : boolean = false;
  userFullName : string;
  storage : Storage = sessionStorage;

  constructor(private oktaAuthService: OktaAuthService) { }

  ngOnInit(): void {

    //subsrcibe to authenticate state changes
    this.oktaAuthService.$authenticationState.subscribe((result) => {
      this.isAuthenticated = result;
      this.getUserDetails();
      
    })
  }

  getUserDetails(){
    if(this.isAuthenticated){
      this.oktaAuthService.getUser().then(
        (res) => {
          this.userFullName = res.name;

          //retrieve users email address from authenticate response
          const email = res.email;

          //store in web storage
          this.storage.setItem('userEmail',JSON.stringify(email));
        }
      )
    }
  }

  logOut(){
    //terminates the session
    this.oktaAuthService.signOut();
  }

}
