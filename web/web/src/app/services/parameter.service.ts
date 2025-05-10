import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ParameterService {

  
  constructor(private http: HttpClient) { }

  paramsList(body: any) {
    return this.http.post(environment.apiUrl + '/parameter/params-list', body);
  }

  crudParam(body: any) {
    return this.http.post(environment.apiUrl + '/parameter/crud-params', body);
  }

  listTypeFees(body: any) {
    return this.http.post(environment.apiUrl + '/parameter/type-fees/list', body);
  }

  crudTypeFees(body: any) {
    return this.http.post(environment.apiUrl + '/parameter/type-fees/crud', body);
  }

  listAccademicYear(body: any) {
    return this.http.post(environment.apiUrl + '/parameter/academic-year/list', body);
  }

  listOperator(body: any) {
    return this.http.post(environment.apiUrl + '/parameter/operator/list', body);
  }

  createOperator(body: any) {
    return this.http.post(environment.apiUrl + '/parameter/operator/create', body);
  }

  deleteOperator(body: any) {
    return this.http.post(environment.apiUrl + '/parameter/operator/delete', body);
  }

  listGroup(body: any) {
    return this.http.post(environment.apiUrl + '/parameter/group/list', body);
  }

  listTypePayment() {
    return this.http.get(environment.apiUrl + '/parameter/type-payment/list');
  }

  distinctAcademicYear(){
    return this.http.get(environment.apiUrl + '/parameter/distinct-years');
  }

}
