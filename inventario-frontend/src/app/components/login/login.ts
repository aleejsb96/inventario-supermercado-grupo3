import { Component, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {
  email = '';
  password = '';
  error = '';
  cargando = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  login() {
    this.error = '';
    this.cargando = true;
    this.cdr.detectChanges();

    this.authService.login(this.email, this.password).subscribe({
      next: (res) => {
        this.cargando = false;
        this.authService.guardarToken(res.token, res.usuario);
        this.router.navigate(['/dashboard']);
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.cargando = false;
        this.error = err.error?.mensaje || 'Credenciales incorrectas';
        this.cdr.detectChanges();
      }
    });
  }
}