import { HttpBackend, HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

const headers = new HttpHeaders();
headers.append('Content-Type', 'multipart/form-data');
headers.append('Accept', 'application/json');

@Injectable({
  providedIn: 'root'
})

export class InscriptionService {

  constructor(private http: HttpClient, handler: HttpBackend) {
    this.http = new HttpClient(handler);
   }

  createInscription(body: any) {
    return this.http.post(environment.apiUrl + '/school/create-inscription', body, {headers});
  }

  getConfirmationCode(body: any) {
    return this.http.post(environment.apiUrl + '/code/confirmation', body);
  }

  getNewConfirmationCode(body: any) {
    return this.http.post(environment.apiUrl + '/new/code/confirmation', body);
  }

  verificationCode(body: any) {
    return this.http.post(environment.apiUrl + '/verify/code', body);
  }
}
