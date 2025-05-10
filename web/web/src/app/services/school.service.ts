import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SchoolService {

  constructor(private http: HttpClient) { }

  createSchoolClasse(body){
    return this.http.post(environment.apiUrl + '/school/create-classe', body);
  }

  getSchoolDetail(body){
    return this.http.post(environment.apiUrl + '/school/detail', body);
  }

  getAllSchool(body) {
  	return this.http.post(environment.apiUrl + '/school/list', body);
  }

  listSchoolClasse(body) {
  	return this.http.post(environment.apiUrl + '/school/list-classe', body);
  }

  listStudents(body) {
  	return this.http.post(environment.apiUrl + '/school/list-student', body);
  }

  getStudentsWithParam(body) {
  	return this.http.post(environment.apiUrl + '/school/get-student-with-param', body);
  }

  downloadModelStudents(){
    return this.http.get(environment.apiUrl + '/school/download-model-student');
  }

  listAcademicYear(){
    return this.http.get(environment.apiUrl + '/academic-year/list');
  }

  addStudentToClasse(body){
    return this.http.post(environment.apiUrl + '/school/add-one-student', body);
  }

  addStudentListToClasse(body){
    return this.http.post(environment.apiUrl + '/school/add-list-student', body);
  }

  getFeesDetailsById(body){
    return this.http.post(environment.apiUrl + '/school/get-fees-details', body);
  }

  getHistoryOfPayment(body){
    return this.http.post(environment.apiUrl + '/payment/get-history', body);
  }

  getPaymentDetails(body){
    return this.http.post(environment.apiUrl + '/payment/get-details', body);
  }
  listGroupe(body){
    return this.http.post(environment.apiUrl + '/school/groupe/list', body);
  }

  listActifGroupe(body){
    return this.http.post(environment.apiUrl + '/school/groupe-actif/list', body);
  }

  createGroupe(body){
    return this.http.post(environment.apiUrl + '/school/groupe/create', body);
  }

  deleteGroupe(body){
    return this.http.post(environment.apiUrl + '/school/groupe/delete', body);
  }

  changeGroupeStatus(body){
    return this.http.post(environment.apiUrl + '/school/groupe/change-status', body);
  }

  transactionEvolutionByMonth(body){
    return this.http.post(environment.apiUrl + '/school/statistic/transaction-evolution', body);
  }

  statisticForFeesCollected(body){
    return this.http.post(environment.apiUrl + '/school/statistic/fees-collected', body);
  }

  getPaymentAggregationByTypeFees(body){
    return this.http.post(environment.apiUrl + '/school/statistic/payment-aggregation-by-typefees', body);
  }

  getYearPaymentPerMonth(body){
    return this.http.post(environment.apiUrl + '/school/statistic/year-payment-per-month', body);
  }

}
