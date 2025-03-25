import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ManageSchoolUserService {

  constructor(private http: HttpClient) { }

  userList(body: any) {
    return this.http.post(environment.apiUrl + '/school/user/list', body);
  }

  updateStatus(body: any) {
    return this.http.post(environment.apiUrl + '/school/user/update-status', body);
  }

  addUser(body: any) {
    return this.http.post(environment.apiUrl + '/school/user/add', body);
  }
}
