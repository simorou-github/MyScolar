import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SchoolInscriptionService {

  constructor(private http: HttpClient) { }

  getFilePath(id: any){
    return this.http.post(environment.apiUrl + '/school/get-file-path', id);
  }

  listInscriptionsPending(body: any) {
    return this.http.post(environment.apiUrl + '/school/list-inscription-pending', body);
  }

  listInscriptionsValidated(body: any) {
    return this.http.post(environment.apiUrl + '/school/list-inscription-validated', body);
  }

  changeStatusOfInscription(body: any) {
    return this.http.post(environment.apiUrl + '/school/change-status', body);
  }

  countries(){
    return this.http.get(environment.apiUrl + '/country/list');
  }

  cities(){
    return this.http.get(environment.apiUrl + '/city/list');
  }

  citiesByCountryId(id: any){
    return this.http.post(environment.apiUrl + '/country/city/list', id);
  }
}
