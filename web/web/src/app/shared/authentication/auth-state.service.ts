import { Injectable, inject } from '@angular/core';
import { TokenService } from './token.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthStateService {

  private loggedIn = new BehaviorSubject<boolean>(this.token.loggedIn());
  authStatus = this.loggedIn.asObservable();

  changeAuthStatus(value:boolean){
    //console.log(value)
    this.loggedIn.next(value);
    //console.log(this.token.loggedIn())
  }

  constructor(private token: TokenService) { }

}
