import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TrackingService } from '../../../core/services/tracking.service';
import { Tracking, TrackingStatus } from '../../../core/models/tracking.model';
import { ProjectService } from '../../../core/services/project.service';
import { QuillModule } from 'ngx-quill';

@Component({
  selector: 'app-tracking-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, QuillModule],
  template: `
    <div class="container mx-auto p-4" *ngIf="tracking">
      <div class="bg-[#131B2C] rounded-lg p-6">
        <h1 class="text-2xl font-bold mb-6 text-white">Detalle de Seguimiento</h1>
        
        <div class="flex justify-between mb-6">
          <div class="space-y-2">
            <div class="flex items-center">
              <span class="text-gray-400 w-32">Proyecto:</span>
              <span class="text-white">{{projectName}}</span>
            </div>
            <div class="flex items-center">
              <span class="text-gray-400 w-32">Desarrollador:</span>
              <span class="text-white">{{tracking.developer}}</span>
            </div>
            <div class="flex items-center">
              <span class="text-gray-400 w-32">Periodo:</span>
              <span class="text-white">
                {{tracking.startDate | date:'dd/MM/yyyy'}} - {{tracking.endDate | date:'dd/MM/yyyy'}}
              </span>
            </div>
          </div>
          
          <div class="space-y-2 min-w-[200px]">
            <div class="flex items-center">
              <span class="text-white mr-4">Coffee Breaks</span>
              <label class="relative inline-flex items-center cursor-pointer ml-auto">
                <input type="checkbox" [(ngModel)]="tracking.coffeeBreaks" class="sr-only peer">
                <div class="w-11 h-6 bg-gray-700 rounded-full peer 
                     peer-checked:after:translate-x-full peer-checked:after:border-white 
                     after:content-[''] after:absolute after:top-[2px] after:left-[2px] 
                     after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all
                     peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div class="flex items-center">
              <span class="text-white mr-4">Code Reviews</span>
              <label class="relative inline-flex items-center cursor-pointer ml-auto">
                <input type="checkbox" [(ngModel)]="tracking.codeReviews" class="sr-only peer">
                <div class="w-11 h-6 bg-gray-700 rounded-full peer 
                     peer-checked:after:translate-x-full peer-checked:after:border-white 
                     after:content-[''] after:absolute after:top-[2px] after:left-[2px] 
                     after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all
                     peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div class="flex items-center">
              <span class="text-white mr-4">Pair Programming</span>
              <label class="relative inline-flex items-center cursor-pointer ml-auto">
                <input type="checkbox" [(ngModel)]="tracking.pairProgramming" class="sr-only peer">
                <div class="w-11 h-6 bg-gray-700 rounded-full peer 
                     peer-checked:after:translate-x-full peer-checked:after:border-white 
                     after:content-[''] after:absolute after:top-[2px] after:left-[2px] 
                     after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all
                     peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>

        <div class="space-y-6 w-full">
          <div>
            <h3 class="text-lg font-semibold mb-2 text-white">Objetivos Completados</h3>
            <quill-editor
              [(ngModel)]="tracking.completedObjectives"
              [styles]="{height: '200px', backgroundColor: 'white', width: '100%'}"
              [modules]="quillModules"
              class="text-black w-full">
            </quill-editor>
          </div>

          <div>
            <h3 class="text-lg font-semibold mb-2 text-white">Objetivos Pendientes</h3>
            <quill-editor
              [(ngModel)]="tracking.pendingObjectives"
              [styles]="{height: '200px', backgroundColor: 'white', width: '100%'}"
              [modules]="quillModules"
              class="text-black w-full">
            </quill-editor>
          </div>

          <div>
            <h3 class="text-lg font-semibold mb-2 text-white">Observaciones</h3>
            <quill-editor
              [(ngModel)]="tracking.observations"
              [styles]="{height: '200px', backgroundColor: 'white', width: '100%'}"
              [modules]="quillModules"
              class="text-black w-full">
            </quill-editor>
          </div>

          <div>
            <h3 class="text-lg font-semibold mb-2 text-white">Próximos Objetivos</h3>
            <quill-editor
              [(ngModel)]="tracking.nextObjectives"
              [styles]="{height: '200px', backgroundColor: 'white', width: '100%'}"
              [modules]="quillModules"
              class="text-black w-full">
            </quill-editor>
          </div>

          <div class="flex justify-end space-x-4 mt-6">
            <button 
              *ngIf="tracking.status !== TrackingStatus.COMPLETED"
              (click)="completeTracking()"
              class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors">
              Finalizar
            </button>
            <button 
              *ngIf="!tracking.reportSent"
              (click)="sendReport()"
              class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
              Enviar Reporte
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    ::ng-deep .ql-toolbar {
      background-color: #131B2C !important;
      border-color: #1B2438 !important;
      border-top-left-radius: 0.375rem;
      border-top-right-radius: 0.375rem;
    }
    
    ::ng-deep .ql-container {
      background-color: white !important;
      border-color: #1B2438 !important;
      border-bottom-left-radius: 0.375rem;
      border-bottom-right-radius: 0.375rem;
    }
    
    ::ng-deep .ql-editor {
      color: #111827 !important;
      min-height: 150px;
    }

    ::ng-deep .ql-toolbar button {
      color: white !important;
    }

    ::ng-deep .ql-toolbar button svg {
      filter: invert(1);
    }

    ::ng-deep .ql-picker {
      color: white !important;
    }

    ::ng-deep .ql-picker-options {
      background-color: #131B2C !important;
      color: white !important;
    }

    ::ng-deep .ql-editor.ql-blank::before {
      color: #6B7280 !important;
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
    private readonly route: ActivatedRoute,
    private readonly trackingService: TrackingService,
    private readonly projectService: ProjectService
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