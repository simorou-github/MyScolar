import { HttpBackend, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ParentInscriptionService {

  private http: HttpClient;

  constructor(handler: HttpBackend) {
    this.http = new HttpClient(handler);
  }

  sendEmailOtp(body: any) {
    return this.http.post(environment.apiUrl + '/parent/inscription/send-email-otp', body);
  }

  resendEmailOtp(body: any) {
    return this.http.post(environment.apiUrl + '/parent/inscription/resend-email-otp', body);
  }

  verifyEmailOtp(body: any) {
    return this.http.post(environment.apiUrl + '/parent/inscription/verify-email-otp', body);
  }

  sendPhoneOtp(body: any) {
    return this.http.post(environment.apiUrl + '/parent/inscription/send-phone-otp', body);
  }

  verifyPhoneOtp(body: any) {
    return this.http.post(environment.apiUrl + '/parent/inscription/verify-phone-otp', body);
  }

  createInscription(body: any) {
    return this.http.post(environment.apiUrl + '/parent/inscription/create', body);
  }

  activateAccount(body: any) {
    return this.http.post(environment.apiUrl + '/parent/inscription/activate', body);
  }

  searchSchools(body: any) {
    return this.http.post(environment.apiUrl + '/parent/inscription/search-school', body);
  }
}
