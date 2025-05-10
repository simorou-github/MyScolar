import { HttpBackend, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PaiementScolaireService {
  
  constructor(private http: HttpClient, handler: HttpBackend) { 
    this.http = new HttpClient(handler);
  }
  
  processUniquePayment(body: any) {
    return this.http.post(environment.apiUrl + '/payment/process-unique-payment', body);
  }
  
  processBatchPayment(body: any) {
    return this.http.post(environment.apiUrl + '/payment/process-batch-payment', body);
  }

}
