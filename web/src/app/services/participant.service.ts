import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ParticipantService {

  constructor(private http: HttpClient) { }

  save(body: any) {
    return this.http.post(environment.apiUrl + '/congres/participant/save', body);
  }

  listParticipants(congres_id: any) {
    return this.http.post(environment.apiUrl + '/congres/participant/list', congres_id);
  }

  delete(body: any) {
    return this.http.post(environment.apiUrl + '/congres/participant/delete', body);
  }

  downloadAllBadges(body: any) {
    return this.http.post(environment.apiUrl + '/congres/participant/generate-all-badges', body);
  }
  
}
