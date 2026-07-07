import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ParentTokenService } from './parent-token.service';

@Injectable({ providedIn: 'root' })
export class ParentAuthGuard {

  constructor(private router: Router, private tokenService: ParentTokenService) { }

  canActivate(): boolean {
    if (this.tokenService.loggedIn()) {
      return true;
    }
    this.router.navigate(['/parent/login']);
    return false;
  }
}
