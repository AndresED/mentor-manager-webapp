import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TrackingService } from '../../../core/services/tracking.service';
import { Tracking, TrackingStatus } from '../../../core/models/tracking.model';
import { ProjectService, Project } from '../../../core/services/project.service';
import { QuillModule } from 'ngx-quill';

@Component({
  selector: 'app-tracking-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, QuillModule],
  template: `
    <div class="container mx-auto p-4">
      <h1 class="text-2xl font-bold mb-4">Detalle de Seguimiento</h1>
      
      <div *ngIf="tracking" class="bg-white shadow rounded-lg p-4 mb-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <p class="mb-2"><strong>Proyecto:</strong> {{projectName}}</p>
            <p class="mb-2"><strong>Desarrollador:</strong> {{tracking.developer}}</p>
            <p class="mb-2">
              <strong>Periodo:</strong> 
              {{tracking.startDate | date:'dd/MM/yyyy'}} - {{tracking.endDate | date:'dd/MM/yyyy'}}
            </p>
            <p class="mb-2">
              <strong>Estado:</strong>
              <span class="px-2 py-1 text-xs rounded-full ml-2" 
                [ngClass]="{
                  'bg-yellow-100 text-yellow-800': tracking.status === TrackingStatus.PENDING,
                  'bg-blue-100 text-blue-800': tracking.status === TrackingStatus.IN_PROGRESS,
                  'bg-green-100 text-green-800': tracking.status === TrackingStatus.COMPLETED
                }">
                {{tracking.status}}
              </span>
            </p>
          </div>
          
          <div>
            <p class="mb-2">
              <strong>Reporte:</strong>
              <span *ngIf="tracking.reportSent" class="text-green-500 ml-2">Enviado</span>
              <span *ngIf="!tracking.reportSent" class="text-red-500 ml-2">Pendiente</span>
            </p>
            
            <div class="mb-2 flex items-center">
              <strong class="mr-2">Coffee Breaks:</strong> 
              <label class="inline-flex items-center cursor-pointer">
                <input type="checkbox" [(ngModel)]="tracking.coffeeBreaks" (change)="saveChanges()" class="sr-only peer">
                <div class="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            
            <div class="mb-2 flex items-center">
              <strong class="mr-2">Code Reviews:</strong> 
              <label class="inline-flex items-center cursor-pointer">
                <input type="checkbox" [(ngModel)]="tracking.codeReviews" (change)="saveChanges()" class="sr-only peer">
                <div class="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            
            <div class="mb-2 flex items-center">
              <strong class="mr-2">Pair Programming:</strong> 
              <label class="inline-flex items-center cursor-pointer">
                <input type="checkbox" [(ngModel)]="tracking.pairProgramming" (change)="saveChanges()" class="sr-only peer">
                <div class="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>
        
        <div class="mb-4">
          <h3 class="text-lg font-semibold mb-2">Objetivos Completados</h3>
          <quill-editor
            [(ngModel)]="tracking.completedObjectives"
            [styles]="{height: '200px'}"
            [modules]="quillModules"
            (onContentChanged)="onContentChanged($event)"
          ></quill-editor>
        </div>
        
        <div class="mb-4">
          <h3 class="text-lg font-semibold mb-2">Objetivos Pendientes</h3>
          <quill-editor
            [(ngModel)]="tracking.pendingObjectives"
            [styles]="{height: '200px'}"
            [modules]="quillModules"
            (onContentChanged)="onContentChanged($event)"
          ></quill-editor>
        </div>
        
        <div class="mb-4">
          <h3 class="text-lg font-semibold mb-2">Observaciones</h3>
          <quill-editor
            [(ngModel)]="tracking.observations"
            [styles]="{height: '200px'}"
            [modules]="quillModules"
            (onContentChanged)="onContentChanged($event)"
          ></quill-editor>
        </div>
        
        <div class="mb-4">
          <h3 class="text-lg font-semibold mb-2">Próximos Objetivos</h3>
          <quill-editor
            [(ngModel)]="tracking.nextObjectives"
            [styles]="{height: '200px'}"
            [modules]="quillModules"
            (onContentChanged)="onContentChanged($event)"
          ></quill-editor>
        </div>
        
        <div class="flex justify-between mt-6">
          <button 
            *ngIf="!tracking.reportSent"
            class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition-colors"
            (click)="sendReport()">
            Enviar Reporte
          </button>
          
          <button 
            *ngIf="tracking.status !== TrackingStatus.COMPLETED"
            class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors"
            (click)="completeTracking()">
            Marcar como Completado
          </button>
        </div>
      </div>
      
      <div *ngIf="!tracking" class="text-center py-8">
        <p class="text-gray-500">Cargando información del seguimiento...</p>
      </div>
      
      <div class="flex justify-end">
        <button 
          class="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded transition-colors"
          (click)="goBack()">
          Volver
        </button>
      </div>
    </div>
  `,
  styles: [`
    /* Estilos adicionales para Quill */
    ::ng-deep .ql-toolbar {
      border-top-left-radius: 0.375rem;
      border-top-right-radius: 0.375rem;
      background-color: #f9fafb;
    }
    
    ::ng-deep .ql-container {
      border-bottom-left-radius: 0.375rem;
      border-bottom-right-radius: 0.375rem;
      background-color: white;
    }
    
    ::ng-deep .ql-editor {
      min-height: 150px;
    }
  `]
})
export class TrackingDetailComponent implements OnInit {
  trackingId: string = '';
  tracking: Tracking | null = null;
  projectName: string = '';
  TrackingStatus = TrackingStatus;
  isSaving: boolean = false;
  saveTimeout: any = null;
  
  quillModules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      ['blockquote', 'code-block'],
      [{ 'header': 1 }, { 'header': 2 }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'script': 'sub'}, { 'script': 'super' }],
      [{ 'indent': '-1'}, { 'indent': '+1' }],
      [{ 'direction': 'rtl' }],
      [{ 'size': ['small', false, 'large', 'huge'] }],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'align': [] }],
      ['clean']
    ]
  };
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private trackingService: TrackingService,
    private projectService: ProjectService
  ) {
    console.log('TrackingDetailComponent constructor');
  }
  
  ngOnInit(): void {
    console.log('TrackingDetailComponent initialized');
    
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      console.log('ID from route params:', id);
      
      if (id) {
        this.trackingId = id;
        this.loadTracking();
      } else {
        console.error('No ID provided in route params');
      }
    });
  }
  
  loadTracking(): void {
    console.log('Loading tracking with ID:', this.trackingId);
    
    this.trackingService.getTrackingById(this.trackingId).subscribe({
      next: (tracking) => {
        console.log('Tracking loaded successfully:', tracking);
        this.tracking = tracking;
        
        if (tracking.projectId) {
          this.loadProject(tracking.projectId);
        }
      },
      error: (error) => {
        console.error('Error loading tracking:', error);
      }
    });
  }
  
  loadProject(projectId: string): void {
    console.log('Loading project with ID:', projectId);
    
    this.projectService.getProjectById(projectId).subscribe({
      next: (project) => {
        console.log('Project loaded successfully:', project);
        this.projectName = project.name;
      },
      error: (error) => {
        console.error('Error loading project:', error);
      }
    });
  }
  
  onContentChanged(event: any): void {
    // Implementar guardado con debounce para no hacer muchas peticiones
    if (this.saveTimeout) {
      clearTimeout(this.saveTimeout);
    }
    
    this.saveTimeout = setTimeout(() => {
      this.saveChanges();
    }, 1000); // Esperar 1 segundo después del último cambio
  }
  
  saveChanges(): void {
    if (this.tracking && !this.isSaving) {
      this.isSaving = true;
      
      const updates = {
        completedObjectives: this.tracking.completedObjectives,
        pendingObjectives: this.tracking.pendingObjectives,
        observations: this.tracking.observations,
        nextObjectives: this.tracking.nextObjectives,
        coffeeBreaks: this.tracking.coffeeBreaks,
        codeReviews: this.tracking.codeReviews,
        pairProgramming: this.tracking.pairProgramming
      };
      
      this.trackingService.updateTracking(this.trackingId, updates).subscribe({
        next: (updatedTracking) => {
          console.log('Tracking updated successfully:', updatedTracking);
          this.isSaving = false;
        },
        error: (error) => {
          console.error('Error updating tracking:', error);
          this.isSaving = false;
        }
      });
    }
  }
  
  sendReport(): void {
    if (this.tracking) {
      this.trackingService.sendReport(this.trackingId).subscribe({
        next: (updatedTracking) => {
          this.tracking = { ...this.tracking, ...updatedTracking };
          alert('Reporte enviado correctamente');
        },
        error: (error) => {
          console.error('Error al enviar el reporte:', error);
        }
      });
    }
  }
  
  completeTracking(): void {
    if (this.tracking) {
      const updates = { status: TrackingStatus.COMPLETED };
      this.trackingService.updateTracking(this.trackingId, updates).subscribe({
        next: (updatedTracking) => {
          this.tracking = { ...this.tracking, ...updatedTracking };
          alert('Seguimiento marcado como completado');
        },
        error: (error) => {
          console.error('Error al actualizar el seguimiento:', error);
        }
      });
    }
  }
  
  goBack(): void {
    history.back();
  }
} 