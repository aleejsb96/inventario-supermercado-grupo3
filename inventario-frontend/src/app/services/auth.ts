import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/login`, { email, password });
  }

  registro(datos: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/registro`, datos);
  }

  guardarToken(token: string, usuario: any): void {
    localStorage.setItem('token', token);
    localStorage.setItem('usuario', JSON.stringify(usuario));
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getUsuario(): any {
    const usuario = localStorage.getItem('usuario');
    return usuario ? JSON.parse(usuario) : null;
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }


getRol(): string {
    const usuario = this.getUsuario();
    return usuario?.rol || 'empleado';
  }

  isAdmin(): boolean {
    return this.getRol() === 'administrador';
  }
}