import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ParentTokenService {

  setToken(access_token: string) {
    localStorage.setItem('parent_access_token', access_token);
  }

  getToken(): string | null {
    return localStorage.getItem('parent_access_token');
  }

  removeToken() {
    localStorage.removeItem('parent_access_token');
  }

  payload(access_token: string) {
    return access_token.split('.')[1];
  }

  decodePayload(token: string) {
    return JSON.parse(atob(this.payload(token)));
  }

  loggedIn(): boolean {
    const token = this.getToken();
    if (!token) {
      return false;
    }
    try {
      this.decodePayload(token);
      return true;
    } catch {
      return false;
    }
  }

  get email() {
    const token = this.getToken();
    return token ? this.decodePayload(token).email : null;
  }

  get firstName() {
    const token = this.getToken();
    return token ? this.decodePayload(token).first_name : null;
  }

  get lastName() {
    const token = this.getToken();
    return token ? this.decodePayload(token).last_name : null;
  }

  get parentId() {
    const token = this.getToken();
    return token ? this.decodePayload(token).id : null;
  }
}
