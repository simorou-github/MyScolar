import { Component, OnInit } from '@angular/core';
import { TokenService } from './shared/authentication/token.service';
import { Router } from '@angular/router';
import { IdleTimeoutService } from './services/idle-timeout.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor( private tokenService: TokenService, private router: Router, private idleService: IdleTimeoutService) {}
  

  ngOnInit() {
   
  }

}
