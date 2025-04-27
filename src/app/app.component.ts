import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from './core/services/auth.service';
import { LoaderComponent } from './shared/components/loader/loader.component';
import { LoaderService } from './core/services/loader.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule, LoaderComponent],
  template: `
    <ng-container *ngIf="loaderService.loading$ | async">
      <app-loader></app-loader>
    </ng-container>

    <ng-container *ngIf="authService.isAuthenticated(); else loginLayout">
      <div class="flex h-screen bg-[#0B0F19]">
        <!-- Sidebar -->
        <aside class="w-64 bg-[#0B0F19] text-gray-100 flex flex-col border-r border-gray-800">
          <!-- Header -->
          <div class="p-4 border-b border-gray-800 flex items-center gap-3">
            <img src="assets/images/logo.png" alt="Logo" class="w-8 h-8"/>
            <span class="text-xl font-bold text-white">DevTrack Pro</span>
          </div>

          <!-- Navigation -->
          <nav class="flex-1 p-4 space-y-2">
            <a routerLink="/dashboard" 
               routerLinkActive="bg-[#131B2C] text-blue-400" 
               class="flex items-center px-4 py-2.5 text-gray-100 rounded-lg hover:bg-[#131B2C] hover:text-white transition-colors">
              <i class="fas fa-home mr-3"></i>
              <span>Dashboard</span>
            </a>
            <a routerLink="/projects" 
               routerLinkActive="bg-[#131B2C] text-blue-400" 
               class="flex items-center px-4 py-2.5 text-gray-100 rounded-lg hover:bg-[#131B2C] hover:text-white transition-colors">
              <i class="fas fa-project-diagram mr-3"></i>
              <span>Projects</span>
            </a>
            <a routerLink="/recipients" 
               routerLinkActive="bg-[#131B2C] text-blue-400"
               class="flex items-center px-4 py-2.5 text-gray-100 rounded-lg hover:bg-[#131B2C] hover:text-white transition-colors">
              <i class="fas fa-users mr-3"></i>
              <span>Recipients</span>
            </a>
          </nav>

          <!-- Footer with Logout -->
          <div class="p-4 border-t border-gray-800">
            <button 
              (click)="logout()" 
              class="flex items-center w-full px-4 py-2.5 text-gray-100 rounded-lg hover:bg-[#131B2C] hover:text-red-400 transition-colors">
              <i class="fas fa-sign-out-alt mr-3"></i>
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </aside>

        <!-- Main Content -->
        <main class="flex-1 bg-[#0B0F19] p-8 overflow-auto">
          <router-outlet></router-outlet>
        </main>
      </div>
    </ng-container>

    <ng-template #loginLayout>
      <router-outlet></router-outlet>
    </ng-template>
  `
})
export class AppComponent {
  constructor(
    public authService: AuthService,
    public loaderService: LoaderService
  ) {}

  logout(): void {
    this.authService.logout();
  }
}