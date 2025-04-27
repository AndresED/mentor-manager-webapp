import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ProjectService } from '../../../core/services/project.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-project-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="container mx-auto p-4">
      <div class="flex justify-between items-center mb-4">
        <h1 class="text-2xl font-bold">Nuevo Proyecto</h1>
        <button 
          class="bg-gray-500 text-white px-4 py-2 rounded"
          (click)="goBack()">
          Cancelar
        </button>
      </div>
      
      <div class="bg-white shadow rounded-lg p-6">
        <form [formGroup]="projectForm" (ngSubmit)="onSubmit()">
          <div class="mb-4">
            <label class="block text-gray-700 text-sm font-bold mb-2" for="name">
              Nombre del Proyecto
            </label>
            <input 
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="name"
              type="text"
              formControlName="name"
              placeholder="Nombre del proyecto">
            <div *ngIf="projectForm.get('name')?.hasError('required') && projectForm.get('name')?.touched" class="text-red-500 text-xs mt-1">
              El nombre del proyecto es obligatorio
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
              placeholder="Descripción del proyecto"></textarea>
            <div *ngIf="projectForm.get('description')?.hasError('required') && projectForm.get('description')?.touched" class="text-red-500 text-xs mt-1">
              La descripción es obligatoria
            </div>
          </div>
          
          <div class="mb-4">
            <label class="block text-gray-700 text-sm font-bold mb-2" for="status">
              Estado
            </label>
            <select 
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="status"
              formControlName="status">
              <option value="Activo">Activo</option>
              <option value="Parado">Parado</option>
              <option value="Soporte">Soporte</option>
              <option value="Finalizado">Finalizado</option>
            </select>
          </div>
          
          <div class="mb-6">
            <label class="block text-gray-700 text-sm font-bold mb-2" for="developer">
              Desarrollador Asignado
            </label>
            <input 
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="developer"
              type="text"
              formControlName="developer"
              placeholder="Nombre del desarrollador">
            <div *ngIf="projectForm.get('developer')?.hasError('required') && projectForm.get('developer')?.touched" class="text-red-500 text-xs mt-1">
              El desarrollador asignado es obligatorio
            </div>
          </div>
          
          <div class="flex justify-end">
            <button 
              type="submit"
              class="bg-blue-500 text-white px-4 py-2 rounded"
              [disabled]="projectForm.invalid || isSubmitting">
              {{isSubmitting ? 'Guardando...' : 'Guardar'}}
            </button>
          </div>
        </form>
      </div>
      
      <!-- Mensaje de error -->
      <div *ngIf="errorMessage" class="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        <p>{{errorMessage}}</p>
      </div>
    </div>
  `,
  styles: []
})
export class ProjectFormComponent implements OnInit {
  projectForm: FormGroup;
  isSubmitting = false;
  errorMessage = '';
  
  constructor(
    private readonly fb: FormBuilder, 
    private readonly router: Router,
    private readonly projectService: ProjectService,
    private readonly toastService: ToastService
  ) {
    this.projectForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      status: ['Activo', Validators.required],
      developer: ['', Validators.required]
    });
  }

  ngOnInit(): void {}
  
  onSubmit(): void {
    if (this.projectForm.valid) {
      this.isSubmitting = true;
      this.errorMessage = '';
      
      const newProject = {
        name: this.projectForm.value.name,
        description: this.projectForm.value.description,
        status: this.projectForm.value.status as 'Activo' | 'Finalizado' | 'Parado' | 'Soporte',
        assignedDeveloper: this.projectForm.value.developer
      };
      
      this.projectService.createProject(newProject).subscribe({
        next: (createdProject) => {
          console.log('Proyecto creado:', createdProject);
          this.isSubmitting = false;
          
          // Mostrar mensaje de éxito
          this.toastService.success('Proyecto creado correctamente');

          
          // Redirigir a la lista de proyectos
          this.router.navigate(['/projects']);
        },
        error: (error) => {
          console.error('Error al crear proyecto:', error);
          this.isSubmitting = false;
          this.errorMessage = 'Error al crear el proyecto: ' + error.message;
        }
      });
    }
  }
  
  goBack(): void {
    this.router.navigate(['/projects']);
  }
} 