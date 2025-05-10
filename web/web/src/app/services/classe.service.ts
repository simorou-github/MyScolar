import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ClasseService {

  constructor(private http: HttpClient) { }

  list() {
  	return this.http.get(environment.apiUrl + '/classe/list');
  }

  listClasseOfSchool(param) {
  	return this.http.post(environment.apiUrl + '/school/list-classe', param);
  }

  create(body:any) {
    return this.http.post(environment.apiUrl + '/classe/create', body);
  }

  delete(body:any) {
    return this.http.post(environment.apiUrl + '/classe/delete', body);
  }

  searchClasse(body:any) {
    return this.http.post(environment.apiUrl + '/classe/search', body);
  }

  

}
