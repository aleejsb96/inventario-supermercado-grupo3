import { Component, OnInit, ChangeDetectorRef, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../navbar/navbar';
import { DashboardService } from '../../services/dashboard';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [NavbarComponent, CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardComponent implements OnInit {
  @ViewChild('graficoOrdenes') graficoOrdenes!: ElementRef;

  totales: any = {};
  stockBajo: any[] = [];
  ordenesPorMes: any[] = [];
  grafico: any = null;

  constructor(
    private dashboardService: DashboardService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.dashboardService.getDashboard().subscribe({
      next: (res: any) => {
        console.log('Dashboard data:', res);
        this.totales = res.totales;
        this.stockBajo = res.stock_bajo;
        this.ordenesPorMes = res.ordenes_por_mes;
        this.cdr.detectChanges();
        setTimeout(() => this.crearGrafico(), 100);
      },
      error: (err: any) => {
        console.error('Error dashboard:', err);
      },
      complete: () => {
        this.cdr.detectChanges();
      }
    });
  }

  crearGrafico() {
    if (!this.graficoOrdenes || this.ordenesPorMes.length === 0) return;

    if (this.grafico) {
      this.grafico.destroy();
    }

    const labels = this.ordenesPorMes.map((o: any) => o.mes);
    const datos = this.ordenesPorMes.map((o: any) => parseInt(o.total));

    this.grafico = new Chart(this.graficoOrdenes.nativeElement, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Órdenes',
          data: datos,
          backgroundColor: '#1a6b1a',
          borderColor: '#f5c500',
          borderWidth: 2,
          borderRadius: 8
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: { stepSize: 1 }
          }
        }
      }
    });
  }
}