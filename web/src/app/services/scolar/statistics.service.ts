import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StatisticsService {

  constructor(private http: HttpClient) { }

  
  getPaymentAggregationByTypeFees(body){
    return this.http.post(environment.apiUrl + '/scolar/statistic/payment-aggregation-by-typefees', body);
  }

  getYearPaymentPerMonth(body){
    return this.http.post(environment.apiUrl + '/scolar/statistic/year-payment-per-month', body);
  }
}
