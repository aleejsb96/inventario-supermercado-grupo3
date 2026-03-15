import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login';
import { RegistroComponent } from './components/registro/registro';
import { DashboardComponent } from './components/dashboard/dashboard';
import { ProductosComponent } from './components/productos/productos';
import { ProveedoresComponent } from './components/proveedores/proveedores';
import { OrdenesComponent } from './components/ordenes/ordenes';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'registro', component: RegistroComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
  { path: 'productos', component: ProductosComponent, canActivate: [authGuard] },
  { path: 'proveedores', component: ProveedoresComponent, canActivate: [authGuard] },
  { path: 'ordenes', component: OrdenesComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: '/login' }
];