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
      <h1 class="text-3xl font-bold mb-6">{{project?.name}}</h1>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div class="bg-white shadow rounded-lg p-4">
          <h2 class="text-xl font-semibold mb-4">Información del Proyecto</h2>
          <p class="mb-2"><strong>Descripción:</strong> {{project?.description}}</p>
          <p class="mb-2"><strong>Desarrollador:</strong> {{project?.assignedDeveloper}}</p>
          <p class="mb-2">
            <strong>Estado:</strong> 
            <span class="px-2 py-1 text-xs rounded-full ml-2" 
              [ngClass]="{
                'bg-green-100 text-green-800': project?.status === 'Activo',
                'bg-yellow-100 text-yellow-800': project?.status === 'Parado',
                'bg-blue-100 text-blue-800': project?.status === 'Soporte',
                'bg-gray-100 text-gray-800': project?.status === 'Finalizado'
              }">
              {{project?.status}}
            </span>
          </p>
        </div>
        
        <div class="bg-white shadow rounded-lg p-4">
          <h2 class="text-xl font-semibold mb-4">Estado del Proyecto</h2>
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">Cambiar Estado</label>
            <select 
              [(ngModel)]="newStatus" 
              class="w-full border rounded px-3 py-2">
              <option value="Activo">Activo</option>
              <option value="Parado">Parado</option>
              <option value="Soporte">Soporte</option>
              <option value="Finalizado">Finalizado</option>
            </select>
          </div>
          <button 
            class="bg-blue-500 text-white px-4 py-2 rounded"
            (click)="updateProjectStatus()">
            Actualizar Estado
          </button>
        </div>
      </div>
      
      <div class="bg-white shadow rounded-lg p-4 mb-6">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-semibold">Seguimientos Recientes</h2>
          <button 
            class="bg-blue-500 text-white px-4 py-2 rounded"
            (click)="createTracking()">
            Nuevo Seguimiento
          </button>
        </div>
        
        <!-- Tabla de seguimientos -->
        <div class="overflow-x-auto">
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
                *ngFor="let tracking of trackings" 
                class="border-b hover:bg-gray-50">
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
                  <a 
                    [href]="'/trackings/' + tracking._id"
                    class="text-blue-500 hover:text-blue-700 mr-2">
                    Ver
                  </a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <!-- Mensaje cuando no hay seguimientos -->
        <div *ngIf="trackings.length === 0" class="text-center py-8">
          <p class="text-gray-500">No hay seguimientos para este proyecto</p>
        </div>
      </div>
      
      <div class="flex justify-end">
        <button 
          class="bg-gray-500 text-white px-4 py-2 rounded"
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