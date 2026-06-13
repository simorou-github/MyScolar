import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class ActivityLogService {

  constructor(private http: HttpClient) {}

  getLogs(filters: any) {
    return this.http.post(environment.apiUrl + '/activity-log/list', filters);
  }

  getLogNames() {
    return this.http.get(environment.apiUrl + '/activity-log/log-names');
  }
}
