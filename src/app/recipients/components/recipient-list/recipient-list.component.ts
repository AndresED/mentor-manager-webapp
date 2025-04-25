import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

interface Recipient {
  id: string;
  name: string;
  email: string;
  role: string;
}

@Component({
  selector: 'app-recipient-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="container mx-auto p-4">
      <div class="flex justify-between items-center mb-4">
        <h1 class="text-2xl font-bold">Destinatarios de Reportes</h1>
        <button 
          class="bg-blue-500 text-white px-4 py-2 rounded"
          (click)="showAddForm = !showAddForm">
          {{showAddForm ? 'Cancelar' : 'Añadir Destinatario'}}
        </button>
      </div>
      
      <!-- Formulario para añadir destinatario -->
      <div *ngIf="showAddForm" class="bg-white shadow rounded-lg p-4 mb-4">
        <h2 class="text-lg font-semibold mb-4">Nuevo Destinatario</h2>
        <form [formGroup]="recipientForm" (ngSubmit)="onSubmit()">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label class="block text-gray-700 text-sm font-bold mb-2" for="name">
                Nombre
              </label>
              <input 
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="name"
                type="text"
                formControlName="name"
                placeholder="Nombre completo">
              <div *ngIf="recipientForm.get('name')?.hasError('required') && recipientForm.get('name')?.touched" class="text-red-500 text-xs mt-1">
                El nombre es obligatorio
              </div>
            </div>
            
            <div>
              <label class="block text-gray-700 text-sm font-bold mb-2" for="email">
                Correo Electrónico
              </label>
              <input 
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="email"
                type="email"
                formControlName="email"
                placeholder="correo@ejemplo.com">
              <div *ngIf="recipientForm.get('email')?.hasError('required') && recipientForm.get('email')?.touched" class="text-red-500 text-xs mt-1">
                El correo es obligatorio
              </div>
              <div *ngIf="recipientForm.get('email')?.hasError('email') && recipientForm.get('email')?.touched" class="text-red-500 text-xs mt-1">
                El formato del correo no es válido
              </div>
            </div>
            
            <div>
              <label class="block text-gray-700 text-sm font-bold mb-2" for="role">
                Rol
              </label>
              <select 
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="role"
                formControlName="role">
                <option value="Cliente">Cliente</option>
                <option value="Gerente">Gerente</option>
                <option value="Desarrollador">Desarrollador</option>
                <option value="Otro">Otro</option>
              </select>
              <div *ngIf="recipientForm.get('role')?.hasError('required') && recipientForm.get('role')?.touched" class="text-red-500 text-xs mt-1">
                El rol es obligatorio
              </div>
            </div>
          </div>
          
          <div class="flex justify-end mt-4">
            <button 
              class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
              [disabled]="!recipientForm.valid">
              Guardar
            </button>
          </div>
        </form>
      </div>
      
      <!-- Lista de destinatarios -->
      <div class="bg-white shadow rounded-lg p-4">
        <h2 class="text-lg font-semibold mb-4">Destinatarios Registrados</h2>
        
        <div class="overflow-x-auto">
          <table class="min-w-full bg-white">
            <thead>
              <tr>
                <th class="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Nombre
                </th>
                <th class="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Correo Electrónico
                </th>
                <th class="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Rol
                </th>
                <th class="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let recipient of recipients">
                <td class="py-2 px-4 border-b border-gray-200">
                  {{recipient.name}}
                </td>
                <td class="py-2 px-4 border-b border-gray-200">
                  {{recipient.email}}
                </td>
                <td class="py-2 px-4 border-b border-gray-200">
                  {{recipient.role}}
                </td>
                <td class="py-2 px-4 border-b border-gray-200">
                  <button 
                    class="text-red-500 hover:text-red-700"
                    (click)="deleteRecipient(recipient.id)">
                    Eliminar
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <!-- Mensaje cuando no hay destinatarios -->
        <div *ngIf="recipients.length === 0" class="text-center py-8">
          <p class="text-gray-500">No hay destinatarios registrados</p>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class RecipientListComponent implements OnInit {
  showAddForm = false;
  recipientForm: FormGroup;
  recipients: Recipient[] = [
    {
      id: '1',
      name: 'Juan Pérez',
      email: 'juan.perez@ejemplo.com',
      role: 'Cliente'
    },
    {
      id: '2',
      name: 'María López',
      email: 'maria.lopez@ejemplo.com',
      role: 'Gerente'
    },
    {
      id: '3',
      name: 'Carlos Rodríguez',
      email: 'carlos.rodriguez@ejemplo.com',
      role: 'Desarrollador'
    }
  ];

  constructor(private fb: FormBuilder) {
    this.recipientForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      role: ['Cliente', Validators.required]
    });
  }

  ngOnInit(): void {}
  
  onSubmit(): void {
    if (this.recipientForm.valid) {
      const newRecipient: Recipient = {
        id: Date.now().toString(), // Generar un ID único
        ...this.recipientForm.value
      };
      
      console.log('Nuevo destinatario:', newRecipient);
      // Aquí iría la lógica para guardar en el backend
      
      // Añadir a la lista local
      this.recipients.push(newRecipient);
      
      // Resetear el formulario
      this.recipientForm.reset({
        role: 'Cliente'
      });
      
      // Ocultar el formulario
      this.showAddForm = false;
    }
  }
  
  deleteRecipient(id: string): void {
    if (confirm('¿Estás seguro de que deseas eliminar este destinatario?')) {
      console.log('Eliminando destinatario:', id);
      // Aquí iría la lógica para eliminar en el backend
      
      // Eliminar de la lista local
      this.recipients = this.recipients.filter(r => r.id !== id);
    }
  }
} 