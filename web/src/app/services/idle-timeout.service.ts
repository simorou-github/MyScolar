import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class IdleTimeoutService {
  private timeoutInMs = environment.timeoutInMs;
  private timeoutId: any;

  constructor(private router: Router, private ngZone: NgZone) {
    this.resetTimer();
    this.initListeners();
  }

  private initListeners() {
    const events = ['mousemove', 'keydown', 'mousedown', 'touchstart'];
    events.forEach(event => {
      window.addEventListener(event, () => this.resetTimer());
    });
  }

  private resetTimer() {
    clearTimeout(this.timeoutId);
    this.ngZone.runOutsideAngular(() => {
      this.timeoutId = setTimeout(() => {
        this.ngZone.run(() => {
          this.logout();
        });
      }, this.timeoutInMs);
    });
  }

  private logout() {
    localStorage.removeItem('token'); // suppression du token
    this.router.navigate(['/auth/login']); // Rediriger vers la page de connexion
  }
}
