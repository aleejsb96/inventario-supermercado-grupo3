import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class NavbarComponent {
  usuario: any;
  mostrarMenu = false;

  constructor(private authService: AuthService, private router: Router) {
    this.usuario = this.authService.getUsuario();
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}