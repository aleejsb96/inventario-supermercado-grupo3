import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../navbar/navbar';
import { ProveedoresService } from '../../services/proveedores';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-proveedores',
  standalone: true,
  imports: [NavbarComponent, CommonModule, FormsModule],
  templateUrl: './proveedores.html',
  styleUrl: './proveedores.css'
})
export class ProveedoresComponent implements OnInit {
  proveedores: any[] = [];
  cargando = false;
  mostrarModal = false;
  modoEdicion = false;
  error = '';
  exito = '';
  esAdmin = false;

  proveedorForm: any = {
    nombre: '',
    contacto: '',
    telefono: '',
    email: '',
    direccion: ''
  };
  proveedorEditandoId: number | null = null;

  constructor(
    private proveedoresService: ProveedoresService,
    private cdr: ChangeDetectorRef,
    private authService: AuthService
  ) {
    this.esAdmin = this.authService.isAdmin();
  }

  ngOnInit() {
    this.proveedoresService.getProveedores().subscribe({
      next: (res: any) => {
        this.proveedores = res;
        this.cdr.detectChanges();
      },
      error: () => {
        this.error = 'Error al cargar proveedores';
        this.cdr.detectChanges();
      }
    });
  }

  abrirModalNuevo() {
    this.modoEdicion = false;
    this.proveedorForm = { nombre: '', contacto: '', telefono: '', email: '', direccion: '' };
    this.proveedorEditandoId = null;
    this.error = '';
    this.exito = '';
    this.mostrarModal = true;
  }

  abrirModalEditar(proveedor: any) {
    this.modoEdicion = true;
    this.proveedorEditandoId = proveedor.id;
    this.proveedorForm = { ...proveedor };
    this.error = '';
    this.exito = '';
    this.mostrarModal = true;
  }

  cerrarModal() {
    this.mostrarModal = false;
  }

  guardar() {
    this.error = '';
    if (this.modoEdicion && this.proveedorEditandoId) {
      this.proveedoresService.actualizarProveedor(this.proveedorEditandoId, this.proveedorForm).subscribe({
        next: () => {
          this.exito = 'Proveedor actualizado correctamente';
          this.cerrarModal();
          this.ngOnInit();
        },
        error: (err: any) => {
          this.error = err.error?.mensaje || 'Error al actualizar';
        }
      });
    } else {
      this.proveedoresService.crearProveedor(this.proveedorForm).subscribe({
        next: () => {
          this.exito = 'Proveedor creado correctamente';
          this.cerrarModal();
          this.ngOnInit();
        },
        error: (err: any) => {
          this.error = err.error?.mensaje || 'Error al crear';
        }
      });
    }
  }

  eliminar(id: number) {
    if (confirm('¿Estás seguro de eliminar este proveedor?')) {
      this.proveedoresService.eliminarProveedor(id).subscribe({
        next: () => {
          this.exito = 'Proveedor eliminado';
          this.ngOnInit();
        },
        error: () => {
          this.error = 'Error al eliminar proveedor';
        }
      });
    }
  }
}