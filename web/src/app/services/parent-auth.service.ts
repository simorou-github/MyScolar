import { HttpBackend, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ParentAuthService {

  private http: HttpClient;

  constructor(handler: HttpBackend) {
    this.http = new HttpClient(handler);
  }

  requestLoginOtp(body: any) {
    return this.http.post(environment.apiUrl + '/parent/auth/request-otp', body);
  }

  verifyLoginOtp(body: any) {
    return this.http.post(environment.apiUrl + '/parent/auth/verify-otp', body);
  }
}
