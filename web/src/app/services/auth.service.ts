import { HttpBackend, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // Pour éviter le http interceptor
  constructor( handler: HttpBackend, private http: HttpClient) { 
    this.http = new HttpClient(handler);
 }

  login(body: any) {
    return this.http.post(environment.apiUrl + '/auth/login', body);
  }

  activateAccount(body: any) {
    return this.http.post(environment.apiUrl + '/activation-account', body);
  }

  passwordReset(body: any){
    return this.http.post(environment.apiUrl + '/password-to-reset', body);
  }

  changePassword(body: any){
    return this.http.post(environment.apiUrl + '/change-pwd', body);
  }
  
  listAccademicYear(body: any) {
    return this.http.post(environment.apiUrl + '/parameter/academic-year/list', body);
  }
}
