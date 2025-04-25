import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RecipientModalComponent } from '../recipient-modal/recipient-modal.component';
import { ProjectService } from '../../../core/services/project.service';
import { RecipientService } from '../../../core/services/recipient.service';
import { Recipient } from '../../../core/models/recipient.model';

@Component({
  selector: 'app-recipient-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RecipientModalComponent],
  template: `
    <div class="container mx-auto p-4">
      <!-- Header -->
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold text-white">Destinatarios de Reportes</h1>
        <button (click)="showModal = true" 
                class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
          Añadir Destinatario
        </button>
      </div>

      <!-- Table Container -->
      <div class="bg-[#131B2C] rounded-lg p-6">
        <h2 class="text-xl font-semibold text-white mb-4">Destinatarios Registrados</h2>
        
        <!-- Table -->
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="text-gray-400 border-b border-gray-700">
                <th class="text-left py-3 px-4">NOMBRE</th>
                <th class="text-left py-3 px-4">CORREO ELECTRÓNICO</th>
                <th class="text-left py-3 px-4">PROYECTO</th>
                <th class="text-left py-3 px-4">ROL</th>
                <th class="text-right py-3 px-4">ACCIONES</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let recipient of recipients" 
                  class="border-b border-gray-700 text-white hover:bg-[#1B2438]">
                <td class="py-3 px-4">{{recipient.name}}</td>
                <td class="py-3 px-4">{{recipient.email}}</td>
                <td class="py-3 px-4">{{getProjectNames(recipient.projects)}}</td>
                <td class="py-3 px-4">{{recipient.role}}</td>
                <td class="py-3 px-4 text-right">
                  <button (click)="deleteRecipient(recipient._id)" 
                          class="text-red-500 hover:text-red-600">
                    Eliminar
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Modal -->
      <app-recipient-modal 
        *ngIf="showModal"
        (close)="showModal = false"
        (save)="addRecipient($event)">
      </app-recipient-modal>
    </div>
  `,
  styles: []
})
export class RecipientListComponent implements OnInit {
  recipients: Recipient[] = [];
  projects: any[] = [];
  showModal = false;

  constructor(
    private recipientService: RecipientService,
    private projectService: ProjectService
  ) {}

  ngOnInit() {
    this.loadProjects();
    this.loadRecipients();
  }

  loadProjects() {
    this.projectService.getProjects().subscribe(
      projects => this.projects = projects
    );
  }

  loadRecipients() {
    this.recipientService.getRecipients().subscribe(
      recipients => this.recipients = recipients
    );
  }

  getProjectNames(projectIds: string[]): string {
    if (!projectIds?.length) return 'N/A';
    return projectIds
      .map(id => {
        const project = this.projects.find(p => p._id === id);
        return project ? project.name : '';
      })
      .filter(name => name)
      .join(', ');
  }

  addRecipient(recipient: Recipient) {
    this.recipientService.createRecipient(recipient).subscribe({
      next: (newRecipient) => {
        this.recipients.push(newRecipient);
        this.showModal = false;
      },
      error: (error) => console.error('Error creating recipient:', error)
    });
  }

  deleteRecipient(id: string | undefined): void {
    if (!id) return;
    
    if (confirm('¿Estás seguro de que deseas eliminar este destinatario?')) {
      this.recipientService.deleteRecipient(id).subscribe({
        next: () => {
          this.recipients = this.recipients.filter(r => r._id !== id);
        },
        error: (error) => console.error('Error deleting recipient:', error)
      });
    }
  }
} 