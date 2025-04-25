import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="flex h-screen bg-[#0B1121]">
      <!-- Sidebar -->
      <aside class="w-64 bg-[#131B2C] p-4">
        <div class="text-white text-xl font-bold mb-8">Dashdark X</div>
        
        <nav class="space-y-2">
          <a routerLink="/dashboard" 
             routerLinkActive="bg-blue-600"
             class="flex items-center text-gray-300 hover:bg-[#1B2438] p-2 rounded-lg">
            <i class="fas fa-home mr-3"></i>
            Dashboard
          </a>
          
          <a routerLink="/projects" 
             routerLinkActive="bg-blue-600"
             class="flex items-center text-gray-300 hover:bg-[#1B2438] p-2 rounded-lg">
            <i class="fas fa-project-diagram mr-3"></i>
            Projects
          </a>
          
          <a routerLink="/tracking" 
             routerLinkActive="bg-blue-600"
             class="flex items-center text-gray-300 hover:bg-[#1B2438] p-2 rounded-lg">
            <span class="material-icons mr-2">track_changes</span>
            Tracking
          </a>

          <a routerLink="/recipients" 
             routerLinkActive="bg-blue-600"
             class="flex items-center text-gray-300 hover:bg-[#1B2438] p-2 rounded-lg">
            <i class="fas fa-users mr-3"></i>
            Recipients
          </a>
          
          <a routerLink="/reports" 
             routerLinkActive="bg-blue-600"
             class="flex items-center text-gray-300 hover:bg-[#1B2438] p-2 rounded-lg">
            <span class="material-icons mr-2">assessment</span>
            Reports
          </a>
        </nav>
      </aside>

      <!-- Main Content -->
      <main class="flex-1 overflow-auto">
        <router-outlet></router-outlet>
      </main>
    </div>
  `
})
export class MainLayoutComponent {} 