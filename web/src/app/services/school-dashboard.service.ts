import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SchoolDashboardService {

  constructor(private http: HttpClient) { }

  
  verifyFeesAssignement(body) {
  	return this.http.post(environment.apiUrl + '/manage-dashboard/verify-fees-assignement', body);
  }
}
