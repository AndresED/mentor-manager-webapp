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
    <div class="max-w-7xl mx-auto">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-semibold text-gray-100">Proyectos</h1>
        <button routerLink="/projects/new" 
                class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
          Nuevo Proyecto
        </button>
      </div>

      <div class="flex gap-2 mb-6">
        <button 
          *ngFor="let filter of filters"
          (click)="filterProjects(filter)"
          [class.bg-blue-600]="currentFilter === filter"
          class="px-4 py-2 rounded-full text-gray-100 hover:bg-[#1B2438] transition-colors"
          [class.bg-[#131B2C]]="currentFilter !== filter">
          {{ filter }}
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div *ngFor="let project of filteredProjects" 
             (click)="navigateToDetail(project._id)"
             class="bg-[#131B2C] p-6 rounded-lg border border-gray-800 hover:border-gray-700 transition-colors cursor-pointer">
          <h3 class="text-xl font-semibold text-gray-100 mb-2">{{ project.name }}</h3>
          <p class="text-gray-300 mb-4">{{ project.description }}</p>
          <div class="flex justify-between items-center">
            <span class="text-gray-300">{{ project.assignedDeveloper }}</span>
            <span [class]="getStatusClass(project.status)"
                  class="px-3 py-1 rounded-full text-sm">
              {{ project.status }}
            </span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .status-active {
      @apply bg-green-900 text-green-300;
    }
    .status-paused {
      @apply bg-yellow-900 text-yellow-300;
    }
    .status-support {
      @apply bg-blue-900 text-blue-300;
    }
    .status-finished {
      @apply bg-gray-900 text-gray-300;
    }
  `]
})
export class ProjectListComponent implements OnInit {
  projects: Project[] = [];
  filteredProjects: Project[] = [];
  currentFilter: string = 'Todos';
  loading = true;
  currentPage = 1;
  itemsPerPage = 12;
  
  filters = ['Todos', 'Activo', 'Parado', 'Soporte', 'Finalizado'];

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

  filterProjects(filter: string): void {
    this.currentFilter = filter;
    
    if (filter === 'Todos') {
      this.filteredProjects = this.projects;
    } else {
      this.filteredProjects = this.projects.filter(project => project.status === filter);
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

  navigateToDetail(id: string | undefined): void {
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

  getStatusClass(status: string): string {
    const statusMap: { [key: string]: string } = {
      'Activo': 'status-active',
      'Parado': 'status-paused',
      'Soporte': 'status-support',
      'Finalizado': 'status-finished'
    };
    return statusMap[status] || '';
  }
} 