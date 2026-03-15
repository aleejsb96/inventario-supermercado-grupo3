import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './registro.html',
  styleUrl: './registro.css'
})
export class RegistroComponent {
  nombre = '';
  email = '';
  password = '';
  rol = 'empleado';
  error = '';
  exito = '';
  cargando = false;

  constructor(private authService: AuthService, private router: Router) {}

  registro() {
    this.error = '';
    this.exito = '';
    this.cargando = true;

    this.authService.registro({ 
      nombre: this.nombre, 
      email: this.email, 
      password: this.password, 
      rol: this.rol 
    }).subscribe({
      next: (res) => {
        this.exito = 'Usuario registrado correctamente. Redirigiendo...';
        setTimeout(() => this.router.navigate(['/login']), 2000);
      },
      error: (err) => {
        this.error = err.error.mensaje || 'Error al registrar';
        this.cargando = false;
      }
    });
  }
}