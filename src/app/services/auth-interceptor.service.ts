import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { OktaAuthService } from '@okta/okta-angular';
import { from, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor {

  constructor(private oktaAuth : OktaAuthService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    //throw new Error('Method not implemented.');
    return from(this.handleAccess(request, next));
  }
  
  private async handleAccess(request: HttpRequest<any>, next: HttpHandler): Promise<HttpEvent<any>> {
    //only add an access token for secured endpoints
    const securedEndPoints = ['http://localhost:8088/api/orders'];
    if(securedEndPoints.some(url => request.urlWithParams.includes(url))) {

      //get access token
      const accessToken = await this.oktaAuth.getAccessToken();

      //clone request and header with access token
      //clone because request is immutable
      request = request.clone({
        setHeaders : {
          Authorization : 'Bearer ' + accessToken,
        }
      })
    }
    return next.handle(request).toPromise();
  }
}
