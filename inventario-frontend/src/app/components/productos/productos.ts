import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../navbar/navbar';
import { ProductosService } from '../../services/productos';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [NavbarComponent, CommonModule, FormsModule],
  templateUrl: './productos.html',
  styleUrl: './productos.css'
})
export class ProductosComponent implements OnInit {
  productos: any[] = [];
  productosFiltrados: any[] = [];
  cargando = false;
  mostrarModal = false;
  modoEdicion = false;
  error = '';
  exito = '';
  esAdmin = false;

  // Filtros
  busqueda = '';
  categoriaSeleccionada = '';
  categorias = ['Lácteos', 'Bebidas', 'Granos y Cereales', 'Carnes', 'Limpieza'];

  productoForm: any = {
    codigo: '',
    nombre: '',
    descripcion: '',
    precio: '',
    stock_minimo: '',
    stock_actual: '',
    categoria: ''
  };
  productoEditandoId: number | null = null;

  constructor(
    private productosService: ProductosService,
    private cdr: ChangeDetectorRef,
    private authService: AuthService
  ) {
    this.esAdmin = this.authService.isAdmin();
  }

  ngOnInit() {
    this.productosService.getProductos().subscribe({
      next: (res: any) => {
        this.productos = res;
        this.productosFiltrados = res;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        this.error = 'Error al cargar productos';
        this.cdr.detectChanges();
      }
    });
  }

  filtrar() {
    this.productosFiltrados = this.productos.filter(p => {
      const coincideBusqueda = this.busqueda === '' ||
        p.nombre.toLowerCase().includes(this.busqueda.toLowerCase()) ||
        p.codigo.toLowerCase().includes(this.busqueda.toLowerCase());

      const coincideCategoria = this.categoriaSeleccionada === '' ||
        p.categoria_nombre === this.categoriaSeleccionada;

      return coincideBusqueda && coincideCategoria;
    });
  }

  limpiarFiltros() {
    this.busqueda = '';
    this.categoriaSeleccionada = '';
    this.productosFiltrados = this.productos;
  }

  abrirModalNuevo() {
    this.modoEdicion = false;
    this.productoForm = { codigo: '', nombre: '', descripcion: '', precio: '', stock_minimo: '', stock_actual: '', categoria: '' };
    this.productoEditandoId = null;
    this.error = '';
    this.exito = '';
    this.mostrarModal = true;
  }

  abrirModalEditar(producto: any) {
    this.modoEdicion = true;
    this.productoEditandoId = producto.id;
    this.productoForm = { ...producto };
    this.error = '';
    this.exito = '';
    this.mostrarModal = true;
  }

  cerrarModal() {
    this.mostrarModal = false;
  }

  guardar() {
    this.error = '';
    if (this.modoEdicion && this.productoEditandoId) {
      this.productosService.actualizarProducto(this.productoEditandoId, this.productoForm).subscribe({
        next: () => {
          this.exito = 'Producto actualizado correctamente';
          this.cerrarModal();
          this.ngOnInit();
        },
        error: (err: any) => {
          this.error = err.error?.mensaje || 'Error al actualizar';
        }
      });
    } else {
      this.productosService.crearProducto(this.productoForm).subscribe({
        next: () => {
          this.exito = 'Producto creado correctamente';
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
    if (confirm('¿Estás seguro de eliminar este producto?')) {
      this.productosService.eliminarProducto(id).subscribe({
        next: () => {
          this.exito = 'Producto eliminado';
          this.ngOnInit();
        },
        error: () => {
          this.error = 'Error al eliminar producto';
        }
      });
    }
  }
}