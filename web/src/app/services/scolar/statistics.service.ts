import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StatisticsService {

  constructor(private http: HttpClient) { }
  blobHttpOptions = {
    responseType: 'blob' as 'json'
  };
  
  getPaymentAggregationByTypeFees(body){
    return this.http.post(environment.apiUrl + '/scolar/statistic/payment-aggregation-by-typefees', body);
  }

  getYearPaymentPerMonth(body){
    return this.http.post(environment.apiUrl + '/scolar/statistic/year-payment-per-month', body);
  }
  
  getFeesBalanceFollowupData(body){
    return this.http.get(environment.apiUrl + '/manage-fees/get-fees-balance-follow-up-data', body);
  }
  
  exportJournal(body){
    return this.http.post(environment.apiUrl + '/manage-fees/generate-balance/by-type-file', body, this.blobHttpOptions);
  }
}
