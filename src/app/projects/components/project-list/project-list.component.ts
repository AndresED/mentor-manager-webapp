import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProjectService, Project } from '../../../core/services/project.service';

@Component({
  selector: 'app-project-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="container mx-auto p-4">
      <div class="flex justify-between items-center mb-4">
        <h1 class="text-2xl font-bold">Proyectos</h1>
        <div>
          <button 
            class="bg-blue-500 text-white px-4 py-2 rounded"
            (click)="createProject()">
            Nuevo Proyecto
          </button>
        </div>
      </div>
      
      <!-- Filtros -->
      <div class="mb-4 flex flex-wrap gap-2">
        <button 
          *ngFor="let filter of filters"
          class="px-4 py-2 rounded-full border"
          [ngClass]="{'bg-blue-500 text-white': currentFilter === filter.value, 'bg-white': currentFilter !== filter.value}"
          (click)="filterProjects(filter.value)">
          {{filter.label}}
        </button>
      </div>
      
      <!-- Cargando -->
      <div *ngIf="loading" class="text-center py-8">
        <p class="text-gray-500">Cargando proyectos...</p>
      </div>
      
      <!-- Lista de proyectos -->
      <div *ngIf="!loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div 
          *ngFor="let project of filteredProjects" 
          class="bg-white shadow rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow"
          (click)="viewProjectDetail(project._id)">
          <h2 class="text-xl font-semibold">{{project.name}}</h2>
          <p class="text-gray-600 mt-2">{{project.description}}</p>
          <div class="flex justify-between items-center mt-4">
            <span class="text-sm text-gray-500">{{project.assignedDeveloper}}</span>
            <span class="px-2 py-1 text-xs rounded-full" 
              [ngClass]="{
                'bg-green-100 text-green-800': project.status === 'Activo',
                'bg-yellow-100 text-yellow-800': project.status === 'Parado',
                'bg-blue-100 text-blue-800': project.status === 'Soporte',
                'bg-gray-100 text-gray-800': project.status === 'Finalizado'
              }">
              {{project.status}}
            </span>
          </div>
        </div>
      </div>
      
      <!-- Paginación -->
      <div *ngIf="!loading && totalPages > 1" class="flex justify-center mt-4">
        <nav>
          <ul class="flex">
            <li *ngFor="let page of getPages()" class="mx-1">
              <button 
                class="px-3 py-1 rounded"
                [ngClass]="{
                  'bg-blue-500 text-white': page === currentPage,
                  'bg-gray-200 text-gray-700': page !== currentPage
                }"
                (click)="changePage(page)">
                {{page}}
              </button>
            </li>
          </ul>
        </nav>
      </div>
      
      <!-- Mensaje cuando no hay proyectos -->
      <div *ngIf="!loading && filteredProjects.length === 0" class="text-center py-8">
        <p class="text-gray-500">No hay proyectos que mostrar</p>
      </div>
    </div>
  `,
  styles: []
})
export class ProjectListComponent implements OnInit {
  projects: Project[] = [];
  filteredProjects: Project[] = [];
  currentFilter: string = 'all';
  loading = true;
  currentPage = 1;
  itemsPerPage = 12;
  
  filters = [
    { label: 'Todos', value: 'all' },
    { label: 'Activo', value: 'Activo' },
    { label: 'Parado', value: 'Parado' },
    { label: 'Soporte', value: 'Soporte' },
    { label: 'Finalizado', value: 'Finalizado' }
  ];

  constructor(
    private readonly projectService: ProjectService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.loadProjects();
  }

  loadProjects(): void {
    this.loading = true;
    this.projectService.getProjects().subscribe({
      next: (projects) => {
        this.projects = projects;
        this.filterProjects(this.currentFilter);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar proyectos:', error);
        this.loading = false;
      }
    });
  }

  filterProjects(status: string): void {
    this.currentFilter = status;
    
    if (status === 'all') {
      this.filteredProjects = this.projects;
    } else {
      this.filteredProjects = this.projects.filter(project => project.status === status);
    }
  }

  get paginatedProjects() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredProjects.slice(startIndex, startIndex + this.itemsPerPage);
  }
  
  get totalPages() {
    return Math.ceil(this.filteredProjects.length / this.itemsPerPage);
  }
  
  getPages(): number[] {
    const pageCount = Math.ceil(this.filteredProjects.length / this.itemsPerPage);
    return Array.from({ length: pageCount }, (_, i) => i + 1);
  }

  changePage(page: number): void {
    this.currentPage = page;
  }

  viewProjectDetail(id: string | undefined): void {
    console.log('Navegando al detalle del proyecto:', id);
    if (id) {
      this.router.navigate(['/projects', id]);
    } else {
      console.error('Error: ID de proyecto indefinido');
    }
  }

  createProject(): void {
    this.router.navigate(['/projects/new']);
  }
} 