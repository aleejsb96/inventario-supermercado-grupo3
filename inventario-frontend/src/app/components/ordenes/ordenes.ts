import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../navbar/navbar';
import { OrdenesService } from '../../services/ordenes';
import { ProductosService } from '../../services/productos';
import { ProveedoresService } from '../../services/proveedores';

@Component({
  selector: 'app-ordenes',
  standalone: true,
  imports: [NavbarComponent, CommonModule, FormsModule],
  templateUrl: './ordenes.html',
  styleUrl: './ordenes.css'
})
export class OrdenesComponent implements OnInit {
  ordenes: any[] = [];
  proveedores: any[] = [];
  productos: any[] = [];
  cargando = false;
  mostrarModal = false;
  mostrarDetalle = false;
  error = '';
  exito = '';
  ordenDetalle: any = null;

  ordenForm: any = {
    proveedor_id: '',
    observaciones: '',
    items: []
  };

  itemTemp: any = {
    producto_id: '',
    cantidad: 1,
    precio_unitario: ''
  };

  constructor(
    private ordenesService: OrdenesService,
    private productosService: ProductosService,
    private proveedoresService: ProveedoresService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.cargarTodo();
  }

  cargarTodo() {
    this.ordenesService.getOrdenes().subscribe({
      next: (res: any) => {
        this.ordenes = res;
        this.cdr.detectChanges();
      },
      error: () => { this.error = 'Error al cargar órdenes'; }
    });

    this.proveedoresService.getProveedores().subscribe({
      next: (res: any) => { this.proveedores = res; }
    });

    this.productosService.getProductos().subscribe({
      next: (res: any) => { this.productos = res; }
    });
  }

  abrirModalNuevo() {
    this.ordenForm = { proveedor_id: '', observaciones: '', items: [] };
    this.itemTemp = { producto_id: '', cantidad: 1, precio_unitario: '' };
    this.error = '';
    this.exito = '';
    this.mostrarModal = true;
  }

  cerrarModal() {
    this.mostrarModal = false;
  }

  agregarItem() {
    if (!this.itemTemp.producto_id || !this.itemTemp.cantidad || !this.itemTemp.precio_unitario) {
      this.error = 'Completa todos los campos del producto';
      return;
    }
    const producto = this.productos.find(p => p.id == this.itemTemp.producto_id);
    this.ordenForm.items.push({
      producto_id: this.itemTemp.producto_id,
      nombre: producto?.nombre || '',
      cantidad: this.itemTemp.cantidad,
      precio_unitario: this.itemTemp.precio_unitario
    });
    this.itemTemp = { producto_id: '', cantidad: 1, precio_unitario: '' };
    this.error = '';
  }

  quitarItem(index: number) {
    this.ordenForm.items.splice(index, 1);
  }

  calcularTotal() {
    return this.ordenForm.items.reduce((sum: number, item: any) => {
      return sum + (item.cantidad * item.precio_unitario);
    }, 0);
  }

  guardar() {
    this.error = '';
    if (!this.ordenForm.proveedor_id) {
      this.error = 'Selecciona un proveedor';
      return;
    }
    if (this.ordenForm.items.length === 0) {
      this.error = 'Agrega al menos un producto';
      return;
    }

    const payload = {
      proveedor_id: this.ordenForm.proveedor_id,
      observaciones: this.ordenForm.observaciones,
      productos: this.ordenForm.items.map((item: any) => ({
        producto_id: item.producto_id,
        cantidad: item.cantidad,
        precio_unitario: item.precio_unitario
      }))
    };

    this.ordenesService.crearOrden(payload).subscribe({
      next: () => {
        this.exito = 'Orden creada correctamente';
        this.cerrarModal();
        this.cargarTodo();
      },
      error: (err: any) => {
        this.error = err.error?.mensaje || 'Error al crear orden';
      }
    });
  }

  cambiarEstado(id: number, estado: string) {
    this.ordenesService.cambiarEstado(id, estado).subscribe({
      next: () => {
        this.exito = `Orden marcada como ${estado}`;
        this.cargarTodo();
      },
      error: () => { this.error = 'Error al cambiar estado'; }
    });
  }

  verDetalle(orden: any) {
    this.ordenesService.getOrdenById(orden.id).subscribe({
      next: (res: any) => {
        console.log('Detalle orden:', res);
        this.ordenDetalle = {
          ...res,
          items: res.detalle
        };
        this.mostrarDetalle = true;
        this.cdr.detectChanges();
      },
      error: () => {
        this.error = 'Error al cargar detalle';
      }
    });
  }

  cerrarDetalle() {
    this.mostrarDetalle = false;
    this.ordenDetalle = null;
  }

  getBadgeClass(estado: string) {
    if (estado === 'pendiente') return 'badge bg-warning text-dark';
    if (estado === 'completada') return 'badge bg-success';
    if (estado === 'cancelada') return 'badge bg-danger';
    return 'badge bg-secondary';
  }
}