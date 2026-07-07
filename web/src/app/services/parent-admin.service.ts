import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

// Service utilisé depuis l'espace École/ScolarPlus (déjà authentifié via le guard 'api').
// On utilise le HttpClient global afin de profiter de l'intercepteur qui injecte
// automatiquement le token de session en cours (École ou Admin ScolarPlus).
@Injectable({
  providedIn: 'root'
})
export class ParentAdminService {

  constructor(private http: HttpClient) { }

  listInscriptionsPending(body: any = {}) {
    return this.http.post(environment.apiUrl + '/parent/manage-inscription/list-pending', body);
  }

  listInscriptionsValidated(body: any = {}) {
    return this.http.post(environment.apiUrl + '/parent/manage-inscription/list-validated', body);
  }

  changeInscriptionStatus(body: any) {
    return this.http.post(environment.apiUrl + '/parent/manage-inscription/change-status', body);
  }

  listPendingLinksForSchool(body: any = {}) {
    return this.http.post(environment.apiUrl + '/parent/manage-link/list-pending', body);
  }

  listActiveLinks(body: any = {}) {
    return this.http.post(environment.apiUrl + '/parent/manage-link/list-active', body);
  }

  validateLink(body: any) {
    return this.http.post(environment.apiUrl + '/parent/manage-link/validate', body);
  }
}
