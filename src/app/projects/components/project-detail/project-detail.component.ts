import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProjectService, Project } from '../../../core/services/project.service';
import { TrackingService } from '../../../core/services/tracking.service';
import { Tracking, TrackingStatus } from '../../../core/models/tracking.model';
import { ProjectStatus } from '../../../core/models/project.model';

@Component({
  selector: 'app-project-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="container mx-auto p-4">
      <h1 class="text-3xl font-bold mb-6 text-gray-100">{{project?.name}}</h1>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div class="bg-[#131B2C] shadow rounded-lg p-4 border border-gray-800">
          <h2 class="text-xl font-semibold mb-4 text-gray-100">Información del Proyecto</h2>
          <p class="mb-2 text-gray-300"><strong class="text-gray-100">Descripción:</strong> {{project?.description}}</p>
          <p class="mb-2 text-gray-300"><strong class="text-gray-100">Desarrollador:</strong> {{project?.assignedDeveloper}}</p>
          <p class="mb-2">
            <strong class="text-gray-100">Estado:</strong> 
            <span class="px-2 py-1 text-xs rounded-full ml-2" 
              [ngClass]="{
                'bg-green-900 text-green-300': project?.status === 'Activo',
                'bg-yellow-900 text-yellow-300': project?.status === 'Parado',
                'bg-blue-900 text-blue-300': project?.status === 'Soporte',
                'bg-gray-900 text-gray-300': project?.status === 'Finalizado'
              }">
              {{project?.status}}
            </span>
          </p>
        </div>
        
        <div class="bg-[#131B2C] shadow rounded-lg p-4 border border-gray-800">
          <h2 class="text-xl font-semibold mb-4 text-gray-100">Estado del Proyecto</h2>
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-300 mb-1">Cambiar Estado</label>
            <select 
              [(ngModel)]="newStatus" 
              class="w-full bg-[#1B2438] border border-gray-700 rounded px-3 py-2 text-gray-100 focus:outline-none focus:border-blue-500">
              <option value="Activo">Activo</option>
              <option value="Parado">Parado</option>
              <option value="Soporte">Soporte</option>
              <option value="Finalizado">Finalizado</option>
            </select>
          </div>
          <button 
            class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors"
            (click)="updateProjectStatus()">
            Actualizar Estado
          </button>
        </div>
      </div>
      
      <div class="bg-[#131B2C] shadow rounded-lg p-4 mb-6 border border-gray-800">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-semibold text-gray-100">Seguimientos Recientes</h2>
          <button 
            class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors"
            (click)="createTracking()">
            Nuevo Seguimiento
          </button>
        </div>
        
        <div class="overflow-x-auto">
          <table class="min-w-full table-auto">
            <thead class="bg-[#1B2438]">
              <tr>
                <th class="px-4 py-2 text-left text-gray-300">Periodo</th>
                <th class="px-4 py-2 text-left text-gray-300">Desarrollador</th>
                <th class="px-4 py-2 text-left text-gray-300">Estado</th>
                <th class="px-4 py-2 text-left text-gray-300">Reporte</th>
                <th class="px-4 py-2 text-left text-gray-300">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr 
                *ngFor="let tracking of trackings" 
                class="border-b border-gray-800 hover:bg-[#1B2438]">
                <td class="px-4 py-2 text-gray-300">
                  {{tracking.startDate | date:'dd/MM/yyyy'}} - {{tracking.endDate | date:'dd/MM/yyyy'}}
                </td>
                <td class="px-4 py-2 text-gray-300">{{tracking.developer}}</td>
                <td class="px-4 py-2">
                  <span class="px-2 py-1 text-xs rounded-full" 
                    [ngClass]="{
                      'bg-yellow-900 text-yellow-300': tracking.status === TrackingStatus.PENDING,
                      'bg-blue-900 text-blue-300': tracking.status === TrackingStatus.IN_PROGRESS,
                      'bg-green-900 text-green-300': tracking.status === TrackingStatus.COMPLETED
                    }">
                    {{tracking.status}}
                  </span>
                </td>
                <td class="px-4 py-2">
                  <span *ngIf="tracking.reportSent" class="text-green-400">Enviado</span>
                  <span *ngIf="!tracking.reportSent" class="text-red-400">Pendiente</span>
                </td>
                <td class="px-4 py-2">
                  <a 
                    [routerLink]="['/trackings', tracking._id]"
                    class="text-blue-400 hover:text-blue-300">
                    Ver
                  </a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div *ngIf="trackings.length === 0" class="text-center py-8">
          <p class="text-gray-500">No hay seguimientos para este proyecto</p>
        </div>
      </div>
      
      <div class="flex justify-end">
        <button 
          class="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded transition-colors"
          (click)="goBack()">
          Volver
        </button>
      </div>
    </div>
  `,
  styles: []
})
export class ProjectDetailComponent implements OnInit {
  projectId: string = '';
  project: Project | null = null;
  trackings: Tracking[] = [];
  newStatus: string = '';
  TrackingStatus = TrackingStatus;
  
  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly projectService: ProjectService,
    private readonly trackingService: TrackingService
  ) {}
  
  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.projectId = id;
        this.loadProject();
        this.loadTrackings();
      }
    });
  }
  
  loadProject(): void {
    this.projectService.getProjectById(this.projectId).subscribe({
      next: (project) => {
        this.project = project;
        this.newStatus = project.status;
      },
      error: (error) => {
        console.error('Error al cargar el proyecto:', error);
      }
    });
  }
  
  loadTrackings(): void {
    this.trackingService.getTrackings(this.projectId).subscribe({
      next: (trackings) => {
        this.trackings = trackings;
      },
      error: (error) => {
        console.error('Error al cargar seguimientos:', error);
      }
    });
  }
  
  updateProjectStatus(): void {
    if (this.project && this.newStatus) {
      const updatedProject = { 
        ...this.project, 
        status: this.newStatus as ProjectStatus 
      };
      
      this.projectService.updateProject(this.projectId, updatedProject).subscribe({
        next: (project) => {
          this.project = project;
          alert('Estado del proyecto actualizado correctamente');
        },
        error: (error) => {
          console.error('Error al actualizar el estado:', error);
        }
      });
    }
  }
  
  createTracking(): void {
    this.router.navigate(['/trackings/new'], { 
      queryParams: { projectId: this.projectId } 
    });
  }
  
  viewTrackingDetail(event: Event, id: string): void {
    event.preventDefault();
    event.stopPropagation();
    
    if (!id) {
      console.error('ID de seguimiento indefinido');
      return;
    }
    
    console.log('Navegando al detalle del seguimiento:', id);
    
    // Usar una URL absoluta con el origen actual
    const baseUrl = window.location.origin;
    window.location.href = `${baseUrl}/trackings/${id}`;
  }
  
  goBack(): void {
    this.router.navigate(['/projects']);
  }
} 