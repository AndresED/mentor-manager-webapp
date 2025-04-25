import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="flex h-screen bg-[#0B0F19]">
      <!-- Sidebar -->
      <aside class="w-64 bg-[#0B0F19] text-gray-100 p-4 border-r border-gray-800">
        <div class="flex items-center mb-8">
          <span class="text-2xl font-bold text-white">Dashdark X</span>
        </div>

        <!-- Search -->
        <div class="mb-6">
          <div class="relative">
            <input 
              type="text" 
              placeholder="Search for..." 
              class="w-full bg-[#131B2C] text-gray-100 rounded-lg py-2 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
            <span class="absolute left-3 top-2.5 text-gray-400">
              <i class="fas fa-search"></i>
            </span>
          </div>
        </div>

        <!-- Navigation -->
        <nav class="space-y-2">
          <a routerLink="/dashboard" 
             routerLinkActive="bg-[#131B2C] text-blue-400" 
             class="flex items-center px-4 py-2 text-gray-100 rounded-lg hover:bg-[#131B2C] hover:text-white transition-colors">
            <i class="fas fa-home mr-3"></i>
            <span>Dashboard</span>
          </a>
          <a routerLink="/projects" 
             routerLinkActive="bg-[#131B2C] text-blue-400" 
             class="flex items-center px-4 py-2 text-gray-100 rounded-lg hover:bg-[#131B2C] hover:text-white transition-colors">
            <i class="fas fa-project-diagram mr-3"></i>
            <span>Projects</span>
          </a>
          <a routerLink="/reports" 
             routerLinkActive="bg-[#131B2C] text-blue-400" 
             class="flex items-center px-4 py-2 text-gray-100 rounded-lg hover:bg-[#131B2C] hover:text-white transition-colors">
            <i class="fas fa-chart-bar mr-3"></i>
            <span>Reports</span>
          </a>
          
        </nav>
      </aside>

      <!-- Main Content -->
      <main class="flex-1 bg-[#0B0F19] p-8 overflow-auto">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      height: 100vh;
    }
  `]
})
export class AppComponent {
  title = 'webapp';
}
