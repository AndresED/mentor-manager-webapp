import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="bg-gray-800 text-white p-4">
      <div class="container mx-auto flex items-center">
        <div class="text-xl font-bold mr-8">Seguimiento de Proyectos</div>
        <div class="flex">
          <a 
            routerLink="/projects" 
            routerLinkActive="bg-blue-600" 
            [routerLinkActiveOptions]="{exact: true}"
            class="px-6 py-2 rounded-md hover:bg-gray-700">
            Proyectos
          </a>
          <a 
            routerLink="/recipients" 
            routerLinkActive="bg-blue-600" 
            [routerLinkActiveOptions]="{exact: true}"
            class="px-6 py-2 rounded-md hover:bg-gray-700">
            Destinatarios
          </a>
        </div>
      </div>
    </nav>
  `,
  styles: []
})
export class NavbarComponent {} 