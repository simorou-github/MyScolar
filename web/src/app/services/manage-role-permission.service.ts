import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Role } from '../interfaces/roles';
import { Permission } from '../interfaces/permissions';

@Injectable({
  providedIn: 'root'
})
export class ManageRolePermissionService {
  
  constructor(private http: HttpClient) { }

  // Obtenir tous les rôles
  getRoles(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/roles`);
  }

  // Obtenir les détails d'un rôle
  getRole(id: number): Observable<Role> {
    return this.http.get<Role>(`${environment.apiUrl}/roles/${id}`);
  }

  // Créer un nouveau rôle
  createRole(roleData: { label: string; permissions: number[] }): Observable<Role> {
    return this.http.post<Role>(`${environment.apiUrl}/roles`, roleData);
  }

  // Mettre à jour un rôle
  updateRole(id: number, roleData: { label: string; permissions: number[] }): Observable<Role> {
    return this.http.put<Role>(`${environment.apiUrl}/roles/${id}`, roleData);
  }

  // Supprimer un rôle
  deleteRole(id: number): Observable<any> {
    return this.http.delete<any>(`${environment.apiUrl}/roles/${id}`);
  }

  // Obtenir toutes les permissions disponibles
  getPermissions(): Observable<Permission[]> {
    return this.http.get<Permission[]>(`${environment.apiUrl}/permissions`);
  }

  
}
