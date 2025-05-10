import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  private loginUrl = environment.apiUrl + '/auth/login';

  getLoginUrl() {
    return this.loginUrl;
  }

  constructor(private router: Router) { }

  // Gérer le jwt token
  handleToken(access_token: any) {
    this.setToken(access_token);
  }

  // Modifier le jwt token
  setToken(access_token: any) {
    return localStorage.setItem('access_token', access_token);
  }

  // Obtenir le jwt token
  getToken() {
    return localStorage.getItem('access_token');
  }

  // Supprimer le jwt token
  removeToken() {
    return localStorage.removeItem('access_token');
  }

  // Tester si le token est valide
  isValid() {
    const access_token = this.getToken();
    if (access_token) {
      const payload = this.payload(access_token);
      if (payload) {
        return (this.decodePayload(access_token).iss === this.getLoginUrl()) ? true : false;
      }
    }
    return false;
  }

  // Obtenir le partie de la charge utile dans le jwt token
  payload(access_token: any) {
    // if(access_token){
    //   console.log(access_token)
    // }
    const payload = access_token.split('.')[1];
    return payload;
  }

  // Tester si l'utilisateur est connecté ou pas
  loggedIn(): boolean {
    return this.isValid();
  }

  // Décoder la charge utile
  decodePayload(token:any){
    const payl = this.payload(token);
    return JSON.parse(atob(payl));
  }

  get getAcademicYear(){
    return this.decodePayload(this.getToken()).ac;
  }

  get getUserEmail(){
    return this.decodePayload(this.getToken()).email;
  }

  get getUserLastName(){
    return this.decodePayload(this.getToken()).last_name;
  }

  get getUserFirstName(){
    return this.decodePayload(this.getToken()).first_name;
  }

  get getUserStatus(){
    return this.decodePayload(this.getToken()).status;
  }

  get getSchoolId(){
    return this.decodePayload(this.getToken()).school_id;
  }

  get getSocialReasonSchool(){
    return this.decodePayload(this.getToken()).social_reason;
  }

  get getRoles(){
    return this.decodePayload(this.getToken()).roles;
  }

  get getTokenType(){
    return this.decodePayload(this.getToken()).token_type;
  }

  
}
