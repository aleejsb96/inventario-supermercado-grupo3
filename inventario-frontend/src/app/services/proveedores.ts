import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth';

@Injectable({
  providedIn: 'root'
})
export class ProveedoresService {
  private apiUrl = 'http://localhost:3000/api/proveedores';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken()}`
    });
  }

  getProveedores(): Observable<any> {
    return this.http.get(this.apiUrl, { headers: this.getHeaders() });
  }

  getProveedorById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  crearProveedor(proveedor: any): Observable<any> {
    return this.http.post(this.apiUrl, proveedor, { headers: this.getHeaders() });
  }

  actualizarProveedor(id: number, proveedor: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, proveedor, { headers: this.getHeaders() });
  }

  eliminarProveedor(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }
}