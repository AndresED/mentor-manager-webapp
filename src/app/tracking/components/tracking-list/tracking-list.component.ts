import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { TrackingService } from '../../../core/services/tracking.service';
import { Tracking, TrackingStatus } from '../../../core/models/tracking.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-tracking-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="container mx-auto p-4">
      <div class="flex justify-between items-center mb-4">
        <h1 class="text-2xl font-bold">Seguimientos</h1>
        <button 
          class="bg-blue-500 text-white px-4 py-2 rounded"
          (click)="createTracking()">
          Nuevo Seguimiento
        </button>
      </div>
      
      <!-- Filtros -->
      <div class="mb-4">
        <label class="mr-2">Filtrar por estado:</label>
        <select 
          [(ngModel)]="statusFilter" 
          (change)="applyFilters()"
          class="border rounded px-2 py-1">
          <option value="all">Todos</option>
          <option [value]="TrackingStatus.PENDING">Pendiente</option>
          <option [value]="TrackingStatus.IN_PROGRESS">En Proceso</option>
          <option [value]="TrackingStatus.COMPLETED">Completado</option>
        </select>
      </div>
      
      <!-- Tabla de seguimientos -->
      <div class="overflow-x-auto bg-white shadow-md rounded-lg">
        <table class="min-w-full table-auto">
          <thead class="bg-gray-100">
            <tr>
              <th class="px-4 py-2 text-left">Periodo</th>
              <th class="px-4 py-2 text-left">Desarrollador</th>
              <th class="px-4 py-2 text-left">Estado</th>
              <th class="px-4 py-2 text-left">Reporte</th>
              <th class="px-4 py-2 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr 
              *ngFor="let tracking of paginatedTrackings" 
              class="border-b hover:bg-gray-50 cursor-pointer"
              (click)="viewTracking(tracking._id)">
              <td class="px-4 py-2">
                {{tracking.startDate | date:'dd/MM/yyyy'}} - {{tracking.endDate | date:'dd/MM/yyyy'}}
              </td>
              <td class="px-4 py-2">{{tracking.developer}}</td>
              <td class="px-4 py-2">
                <span class="px-2 py-1 text-xs rounded-full" 
                  [ngClass]="{
                    'bg-yellow-100 text-yellow-800': tracking.status === TrackingStatus.PENDING,
                    'bg-blue-100 text-blue-800': tracking.status === TrackingStatus.IN_PROGRESS,
                    'bg-green-100 text-green-800': tracking.status === TrackingStatus.COMPLETED
                  }">
                  {{tracking.status}}
                </span>
              </td>
              <td class="px-4 py-2">
                <span *ngIf="tracking.reportSent" class="text-green-500">Enviado</span>
                <span *ngIf="!tracking.reportSent" class="text-red-500">Pendiente</span>
              </td>
              <td class="px-4 py-2">
                <button 
                  class="text-blue-500 hover:text-blue-700 mr-2"
                  (click)="viewTracking(tracking._id); $event.stopPropagation()">
                  Ver
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!-- Paginación -->
      <div class="flex justify-between items-center mt-4">
        <div>
          <span>Mostrando {{startIndex + 1}} a {{endIndex}} de {{filteredTrackings.length}} seguimientos</span>
        </div>
        <div class="flex space-x-2">
          <button 
            [disabled]="currentPage === 1"
            [ngClass]="{'opacity-50 cursor-not-allowed': currentPage === 1}"
            class="px-3 py-1 border rounded"
            (click)="goToPage(currentPage - 1)">
            Anterior
          </button>
          <button 
            *ngFor="let page of getPageNumbers()"
            [ngClass]="{'bg-blue-500 text-white': page === currentPage, 'bg-white': page !== currentPage}"
            class="px-3 py-1 border rounded"
            (click)="goToPage(page)">
            {{page}}
          </button>
          <button 
            [disabled]="currentPage === totalPages"
            [ngClass]="{'opacity-50 cursor-not-allowed': currentPage === totalPages}"
            class="px-3 py-1 border rounded"
            (click)="goToPage(currentPage + 1)">
            Siguiente
          </button>
        </div>
      </div>
      
      <!-- Mensaje cuando no hay seguimientos -->
      <div *ngIf="filteredTrackings.length === 0" class="text-center py-8">
        <p class="text-gray-500">No hay seguimientos que mostrar</p>
      </div>
    </div>
  `,
  styles: []
})
export class TrackingListComponent implements OnInit {
  trackings: Tracking[] = [];
  filteredTrackings: Tracking[] = [];
  paginatedTrackings: Tracking[] = [];
  
  // Filtros
  statusFilter: string = 'all';
  
  // Paginación
  currentPage: number = 1;
  pageSize: number = 10;
  totalPages: number = 1;
  startIndex: number = 0;
  endIndex: number = 0;
  
  // Enum para usar en el template
  TrackingStatus = TrackingStatus;

  constructor(
    private readonly trackingService: TrackingService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.loadTrackings();
  }

  loadTrackings(): void {
    this.trackingService.getTrackings().subscribe({
      next: (trackings) => {
        this.trackings = trackings;
        this.applyFilters();
      },
      error: (error) => {
        console.error('Error al cargar seguimientos:', error);
      }
    });
  }

  applyFilters(): void {
    let filtered = [...this.trackings];
    
    // Filtrar por estado
    if (this.statusFilter !== 'all') {
      filtered = filtered.filter(tracking => tracking.status === this.statusFilter);
    }
    
    this.filteredTrackings = filtered;
    this.calculatePagination();
  }

  calculatePagination(): void {
    this.totalPages = Math.ceil(this.filteredTrackings.length / this.pageSize);
    
    if (this.currentPage > this.totalPages && this.totalPages > 0) {
      this.currentPage = this.totalPages;
    }
    
    this.startIndex = (this.currentPage - 1) * this.pageSize;
    this.endIndex = Math.min(this.startIndex + this.pageSize, this.filteredTrackings.length);
    
    this.paginatedTrackings = this.filteredTrackings.slice(this.startIndex, this.endIndex);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.calculatePagination();
    }
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxPagesToShow = 5;
    
    if (this.totalPages <= maxPagesToShow) {
      // Mostrar todas las páginas si son pocas
      for (let i = 1; i <= this.totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Mostrar un subconjunto de páginas
      let startPage = Math.max(1, this.currentPage - 2);
      let endPage = Math.min(this.totalPages, startPage + maxPagesToShow - 1);
      
      if (endPage - startPage < maxPagesToShow - 1) {
        startPage = Math.max(1, endPage - maxPagesToShow + 1);
      }
      
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
    }
    
    return pages;
  }

  viewTracking(id: string): void {
    console.log('id recibido '+ id)
    this.router.navigate(['/trackings', id]);
  }

  createTracking(): void {
    this.router.navigate(['/trackings/new']);
  }
} 