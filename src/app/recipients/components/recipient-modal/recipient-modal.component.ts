import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProjectService } from '../../../core/services/project.service';

interface RecipientRequest {
  name: string;
  email: string;
  role: string;
  projects: string[];
}

@Component({
  selector: 'app-recipient-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div class="bg-[#131B2C] p-6 rounded-lg w-full max-w-md">
        <h2 class="text-xl font-bold text-white mb-4">Añadir Destinatario</h2>
        
        <form (ngSubmit)="onSubmit()" #form="ngForm">
          <div class="space-y-4">
            <div>
              <label class="block text-gray-400 mb-2">Nombre</label>
              <input type="text" 
                     [(ngModel)]="name" 
                     name="name"
                     required
                     class="w-full bg-[#1B2438] text-white p-2 rounded-lg border border-gray-700">
            </div>
            
            <div>
              <label class="block text-gray-400 mb-2">Correo Electrónico</label>
              <input type="email" 
                     [(ngModel)]="email" 
                     name="email"
                     required
                     class="w-full bg-[#1B2438] text-white p-2 rounded-lg border border-gray-700">
            </div>
            
            <div>
              <label class="block text-gray-400 mb-2">Proyectos</label>
              <select [(ngModel)]="selectedProjects" 
                      name="projects"
                      multiple
                      required
                      size="4"
                      (change)="onProjectsChange($event)"
                      class="w-full bg-[#1B2438] text-white p-2 rounded-lg border border-gray-700">
                <option *ngFor="let project of projects" [value]="project._id">
                  {{project.name}}
                </option>
              </select>
              <p class="text-xs text-gray-400 mt-1">
                Mantén presionado Ctrl (Cmd en Mac) para seleccionar múltiples proyectos
              </p>
            </div>

            <div>
              <label class="block text-gray-400 mb-2">Rol</label>
              <select [(ngModel)]="role" 
                      name="role"
                      required
                      class="w-full bg-[#1B2438] text-white p-2 rounded-lg border border-gray-700">
                <option value="Cliente">Cliente</option>
                <option value="Gerente">Gerente</option>
                <option value="Desarrollador">Desarrollador</option>
              </select>
            </div>
          </div>

          <div class="flex justify-end space-x-3 mt-6">
            <button type="button"
                    (click)="close.emit()"
                    class="px-4 py-2 text-gray-400 hover:text-white transition-colors">
              Cancelar
            </button>
            <button type="submit"
                    [disabled]="!form.valid || selectedProjects.length === 0"
                    class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class RecipientModalComponent implements OnInit {
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<any>();

  projects: any[] = [];
  selectedProjects: string[] = [];
  name = '';
  email = '';
  role = 'Cliente';

  constructor(private projectService: ProjectService) {}

  ngOnInit() {
    this.loadProjects();
  }

  loadProjects() {
    this.projectService.getProjects().subscribe(
      projects => this.projects = projects
    );
  }

  onProjectsChange(event: any) {
    this.selectedProjects = [...event.target.selectedOptions]
      .map(option => option.value)
      .map(value => {
        // Extraer solo el ID usando regex
        const match = value.match(/([a-f0-9]{24})/);
        return match ? match[1] : value;
      });
  }

  onSubmit() {
    if (this.name && this.email && this.role && this.selectedProjects.length > 0) {
      const recipient = {
        name: this.name,
        email: this.email,
        role: this.role,
        projects: this.selectedProjects
      };
      
      this.save.emit(recipient);
    }
  }
} 