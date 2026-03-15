import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth';

@Injectable({
  providedIn: 'root'
})
export class OrdenesService {
  private apiUrl = 'http://localhost:3000/api/ordenes';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken()}`
    });
  }

  getOrdenes(): Observable<any> {
    return this.http.get(this.apiUrl, { headers: this.getHeaders() });
  }

  getOrdenById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  crearOrden(orden: any): Observable<any> {
    return this.http.post(this.apiUrl, orden, { headers: this.getHeaders() });
  }

  cambiarEstado(id: number, estado: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}/estado`, { estado }, { headers: this.getHeaders() });
  }
}