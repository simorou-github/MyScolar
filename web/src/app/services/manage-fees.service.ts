import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ManageFeesService {

  constructor(private http: HttpClient) { }

  assigneFeesToSchoolClasse(body: any) {
    return this.http.post(environment.apiUrl + '/manage-fees/assign-fees-to-classe', body);
  }

  getStudendFeesBalance(body: any) {
    return this.http.post(environment.apiUrl + '/manage-fees/get-student-balance', body);
  }

  getFeesDetailsData(body: any) {
    return this.http.post(environment.apiUrl + '/manage-fees/get-fees-details-data', body);
  }

  searchStudentFeesBalanceForCaissePayment(body: any) {
    return this.http.post(environment.apiUrl + '/manage-fees/search-student-balance-for-caisse', body);
  }

  publicSearchStudentFeesBalanceForParentPayment(body: any) {
    return this.http.post(environment.apiUrl + '/manage-fees/public-search-student-balance', body);
  }

}
