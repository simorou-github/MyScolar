import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ManageUserService {

  constructor(private http: HttpClient) { }

  userList(body: any) {
    return this.http.post(environment.apiUrl + '/manage-user/list', body);
  }

  deleteUser(body: any) {
    return this.http.post(environment.apiUrl + '/manage-user/delete', body);
  }

  changeStatusOfUser(body: any) {
    return this.http.post(environment.apiUrl + '/manage-user/change-status', body);
  }

  addUserByAdmin(body: any) {
    return this.http.post(environment.apiUrl + '/manage-user/add-by-admin', body);
  }
}
