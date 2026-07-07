import { HttpBackend, HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ParentTokenService } from '../shared/authentication/parent-token.service';

@Injectable({
  providedIn: 'root'
})
export class ParentSpaceService {

  private http: HttpClient;

  constructor(handler: HttpBackend, private tokenService: ParentTokenService) {
    // On utilise HttpBackend pour s'affranchir de l'intercepteur global (qui injecte
    // le token JWT de l'espace École) : l'espace Parent a sa propre session.
    this.http = new HttpClient(handler);
  }

  private authHeaders(): HttpHeaders {
    return new HttpHeaders({ Authorization: 'Bearer ' + (this.tokenService.getToken() ?? '') });
  }

  me() {
    return this.http.get(environment.apiUrl + '/parent/space/me', { headers: this.authHeaders() });
  }

  logout() {
    return this.http.post(environment.apiUrl + '/parent/space/logout', {}, { headers: this.authHeaders() });
  }

  searchStudent(body: any) {
    return this.http.post(environment.apiUrl + '/parent/space/search-student', body, { headers: this.authHeaders() });
  }

  requestLink(body: any) {
    return this.http.post(environment.apiUrl + '/parent/space/request-link', body, { headers: this.authHeaders() });
  }

  myLinks() {
    return this.http.get(environment.apiUrl + '/parent/space/my-links', { headers: this.authHeaders() });
  }

  getStudentBalance(body: any) {
    return this.http.post(environment.apiUrl + '/parent/space/student-balance', body, { headers: this.authHeaders() });
  }

  getStudentAcademicYears(body: any) {
    return this.http.post(environment.apiUrl + '/parent/space/student-academic-years', body, { headers: this.authHeaders() });
  }
}
