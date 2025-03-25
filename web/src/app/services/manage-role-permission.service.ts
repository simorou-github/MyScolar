import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ManageRolePermissionService {
  
  constructor(private http: HttpClient) { }

  roles(body: any) {
    return this.http.post(environment.apiUrl + '/user/get-all-role', body);
  }

  permissions(body: any) {
    return this.http.post(environment.apiUrl + '/user/get-all-permission', body);
  }

  getPermissionsOfRoles(body: any) {
    return this.http.post(environment.apiUrl + '/user/get-permissions-of-role', body);
  }

  saveRole(body: any) {
    return this.http.post(environment.apiUrl + '/user/save-role', body);
  }
}
