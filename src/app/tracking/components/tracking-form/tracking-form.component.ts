import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TrackingService } from '../../../core/services/tracking.service';
import { ProjectService } from '../../../core/services/project.service';
import { Tracking } from '../../../core/models/tracking.model';

@Component({
  selector: 'app-tracking-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="container mx-auto p-4">
      <div class="flex justify-between items-center mb-4">
        <h1 class="text-2xl font-bold">Nuevo Seguimiento</h1>
        <button 
          class="bg-gray-500 text-white px-4 py-2 rounded"
          (click)="goBack()">
          Cancelar
        </button>
      </div>
      
      <!-- Cargando -->
      <div *ngIf="loading" class="text-center py-8">
        <p class="text-gray-500">Cargando información del proyecto...</p>
      </div>
      
      <!-- Error -->
      <div *ngIf="errorMessage" class="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        <p>{{errorMessage}}</p>
        <button 
          class="mt-2 bg-gray-500 text-white px-3 py-1 rounded text-sm"
          (click)="goBack()">
          Volver
        </button>
      </div>
      
      <!-- Formulario -->
      <div *ngIf="!loading && !errorMessage" class="bg-white shadow rounded-lg p-6">
        <div *ngIf="project" class="mb-4 p-3 bg-blue-50 rounded-lg">
          <p class="text-blue-800"><strong>Proyecto:</strong> {{project.name}}</p>
          <p class="text-blue-800"><strong>Desarrollador:</strong> {{project.assignedDeveloper}}</p>
        </div>
        
        <form [formGroup]="trackingForm" (ngSubmit)="onSubmit()">
          <div class="mb-4">
            <label class="block text-gray-700 text-sm font-bold mb-2" for="name">
              Nombre del Seguimiento
            </label>
            <input 
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="name"
              type="text"
              formControlName="name"
              placeholder="Ej: Semana del 1 al 5 de Marzo">
            <div *ngIf="trackingForm.get('name')?.hasError('required') && trackingForm.get('name')?.touched" class="text-red-500 text-xs mt-1">
              El nombre del seguimiento es obligatorio
            </div>
          </div>
          
          <div class="mb-4">
            <label class="block text-gray-700 text-sm font-bold mb-2" for="description">
              Descripción
            </label>
            <textarea 
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="description"
              formControlName="description"
              rows="4"
              placeholder="Descripción detallada del seguimiento"></textarea>
            <div *ngIf="trackingForm.get('description')?.hasError('required') && trackingForm.get('description')?.touched" class="text-red-500 text-xs mt-1">
              La descripción es obligatoria
            </div>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label class="block text-gray-700 text-sm font-bold mb-2" for="startDate">
                Fecha de Inicio
              </label>
              <input 
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="startDate"
                type="date"
                formControlName="startDate">
              <div *ngIf="trackingForm.get('startDate')?.hasError('required') && trackingForm.get('startDate')?.touched" class="text-red-500 text-xs mt-1">
                La fecha de inicio es obligatoria
              </div>
            </div>
            
            <div>
              <label class="block text-gray-700 text-sm font-bold mb-2" for="endDate">
                Fecha de Fin
              </label>
              <input 
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="endDate"
                type="date"
                formControlName="endDate">
              <div *ngIf="trackingForm.get('endDate')?.hasError('required') && trackingForm.get('endDate')?.touched" class="text-red-500 text-xs mt-1">
                La fecha de fin es obligatoria
              </div>
            </div>
          </div>
          
          <div class="mb-6">
            <label class="block text-gray-700 text-sm font-bold mb-2" for="status">
              Estado
            </label>
            <select 
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="status"
              formControlName="status">
              <option value="En proceso">En proceso</option>
              <option value="Finalizado">Finalizado</option>
            </select>
          </div>
          
          <div class="mb-6">
            <h3 class="text-lg font-semibold mb-4">Actividades</h3>
            
            <div class="space-y-4">
              <!-- Coffee Breaks -->
              <div>
                <div class="flex items-center mb-2">
                  <input 
                    type="checkbox"
                    id="coffeeBreaks"
                    formControlName="coffeeBreaks"
                    class="mr-2">
                  <label for="coffeeBreaks" class="text-gray-700">Coffee Breaks</label>
                </div>
                <textarea 
                  *ngIf="trackingForm.get('coffeeBreaks')?.value"
                  formControlName="notesCoffeeBreaks"
                  rows="3"
                  class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="Notas sobre coffee breaks..."></textarea>
              </div>

              <!-- Code Reviews -->
              <div>
                <div class="flex items-center mb-2">
                  <input 
                    type="checkbox"
                    id="codeReviews"
                    formControlName="codeReviews"
                    class="mr-2">
                  <label for="codeReviews" class="text-gray-700">Code Reviews</label>
                </div>
                <textarea 
                  *ngIf="trackingForm.get('codeReviews')?.value"
                  formControlName="notesCodeReviews"
                  rows="3"
                  class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="Notas sobre code reviews..."></textarea>
              </div>

              <!-- Pair Programming -->
              <div>
                <div class="flex items-center mb-2">
                  <input 
                    type="checkbox"
                    id="pairProgramming"
                    formControlName="pairProgramming"
                    class="mr-2">
                  <label for="pairProgramming" class="text-gray-700">Pair Programming</label>
                </div>
                <textarea 
                  *ngIf="trackingForm.get('pairProgramming')?.value"
                  formControlName="notesPairProgramming"
                  rows="3"
                  class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="Notas sobre pair programming..."></textarea>
              </div>
            </div>
          </div>
          
          <div class="flex justify-end">
            <button 
              type="submit"
              class="bg-blue-500 text-white px-4 py-2 rounded"
              [disabled]="trackingForm.invalid || isSubmitting">
              {{isSubmitting ? 'Guardando...' : 'Guardar'}}
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: []
})
export class TrackingFormComponent implements OnInit {
  trackingForm: FormGroup;
  projectId: string = '';
  project: any = null;
  loading = true;
  errorMessage = '';
  isSubmitting = false;
  
  constructor(
    private readonly fb: FormBuilder,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly trackingService: TrackingService,
    private readonly projectService: ProjectService
  ) {
    this.trackingForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      status: ['En proceso', Validators.required],
      coffeeBreaks: [false],
      notesCoffeeBreaks: [''],
      codeReviews: [false],
      notesCodeReviews: [''],
      pairProgramming: [false],
      notesPairProgramming: [''],
      weeklyMeetings: [false],
      notesWeeklyMeetings: ['']
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.projectId = params['projectId'] ?? '';
      
      if (this.projectId) {
        this.loadProject();
      } else {
        this.loading = false;
        this.errorMessage = 'No se ha especificado un proyecto para el seguimiento';
      }
    });
  }
  
  loadProject(): void {
    this.loading = true;
    this.errorMessage = '';
    
    this.projectService.getProjectById(this.projectId).subscribe(
      (data) => {
        this.project = data;
        this.loading = false;
      },
      (error) => {
        console.error('Error al cargar el proyecto:', error);
        this.loading = false;
        this.errorMessage = 'Error al cargar el proyecto: ' + error.message;
      }
    );
  }
  
  onSubmit(): void {
    if (this.trackingForm.valid && this.projectId) {
      this.isSubmitting = true;
      this.errorMessage = '';
      
      const formData = this.trackingForm.value;
      
      // Si no está marcado el checkbox, enviamos string vacío en las notas
      if (!formData.coffeeBreaks) formData.notesCoffeeBreaks = '';
      if (!formData.codeReviews) formData.notesCodeReviews = '';
      if (!formData.pairProgramming) formData.notesPairProgramming = '';

      const newTracking: Omit<Tracking, '_id'> = {
        projectId: this.projectId,
        name: formData.name,
        description: formData.description,
        startDate: new Date(formData.startDate),
        endDate: new Date(formData.endDate),
        status: formData.status,
        developer: this.project.assignedDeveloper,
        reportSent: false,
        completedObjectives: '',
        pendingObjectives: '',
        observations: '',
        nextObjectives: '',
        coffeeBreaks: formData.coffeeBreaks,
        codeReviews: formData.codeReviews,
        pairProgramming: formData.pairProgramming,
        weeklyMeetings: formData.weeklyMeetings || false,
        notesWeeklyMeetings: formData.weeklyMeetings ? formData.notesWeeklyMeetings : '',
      };
      
      this.trackingService.createTracking(newTracking).subscribe(
        (createdTracking) => {
          console.log('Seguimiento creado:', createdTracking);
          this.isSubmitting = false;
          
          // Mostrar mensaje de éxito
          alert('Seguimiento creado correctamente');
          
          // Redirigir al detalle del proyecto
          this.router.navigate(['/projects', this.projectId]);
        },
        (error) => {
          console.error('Error al crear seguimiento:', error);
          this.isSubmitting = false;
          this.errorMessage = 'Error al crear el seguimiento: ' + error.message;
        }
      );
    }
  }
  
  goBack(): void {
    if (this.projectId) {
      this.router.navigate(['/projects', this.projectId]);
    } else {
      this.router.navigate(['/projects']);
    }
  }
} 