import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container mx-auto p-4">
      <h1 class="text-2xl font-bold text-white mb-6">Dashboard</h1>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <!-- KPIs -->
        <div class="bg-[#131B2C] p-4 rounded-lg">
          <h3 class="text-gray-400 text-sm">Proyectos Activos</h3>
          <p class="text-2xl font-bold text-white">{{activeProjects}}</p>
        </div>
        
        <div class="bg-[#131B2C] p-4 rounded-lg">
          <h3 class="text-gray-400 text-sm">Seguimientos Pendientes</h3>
          <p class="text-2xl font-bold text-white">{{pendingTrackings}}</p>
        </div>
        
        <div class="bg-[#131B2C] p-4 rounded-lg">
          <h3 class="text-gray-400 text-sm">Reportes Esta Semana</h3>
          <p class="text-2xl font-bold text-white">{{weeklyReports}}</p>
        </div>
        
        <div class="bg-[#131B2C] p-4 rounded-lg">
          <h3 class="text-gray-400 text-sm">Desarrolladores Activos</h3>
          <p class="text-2xl font-bold text-white">{{activeDevelopers}}</p>
        </div>
      </div>

      <!-- Próximos Seguimientos -->
      <div class="bg-[#131B2C] rounded-lg p-6 mb-6">
        <h2 class="text-xl font-bold text-white mb-4">Próximos Seguimientos</h2>
        <div class="space-y-2">
          <div *ngFor="let tracking of upcomingTrackings" 
               class="flex items-center justify-between p-3 bg-[#1B2438] rounded-lg">
            <div>
              <p class="text-white font-medium">{{tracking.projectName}}</p>
              <p class="text-sm text-gray-400">{{tracking.developer}}</p>
            </div>
            <div class="text-right">
              <p class="text-white">{{tracking.date | date:'dd/MM/yyyy'}}</p>
              <p class="text-sm text-gray-400">{{tracking.time}}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Estado de Proyectos -->
        <div class="bg-[#131B2C] rounded-lg p-6">
          <h2 class="text-xl font-bold text-white mb-4">Estado de Proyectos</h2>
          <div class="space-y-4">
            <div *ngFor="let project of projectStatus">
              <div class="flex justify-between text-sm mb-1">
                <span class="text-white">{{project.name}}</span>
                <span class="text-gray-400">{{project.progress}}%</span>
              </div>
              <div class="w-full bg-gray-700 rounded-full h-2">
                <div class="bg-blue-600 h-2 rounded-full" 
                     [style.width]="project.progress + '%'"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Actividad Reciente -->
        <div class="bg-[#131B2C] rounded-lg p-6">
          <h2 class="text-xl font-bold text-white mb-4">Actividad Reciente</h2>
          <div class="space-y-4">
            <div *ngFor="let activity of recentActivity" 
                 class="flex items-start space-x-3 p-2">
              <div [ngClass]="activity.iconClass" class="p-2 rounded-full"></div>
              <div>
                <p class="text-white">{{activity.description}}</p>
                <p class="text-sm text-gray-400">{{activity.time}}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class DashboardComponent implements OnInit {
  activeProjects: number = 0;
  pendingTrackings: number = 0;
  weeklyReports: number = 0;
  activeDevelopers: number = 0;
  
  upcomingTrackings: any[] = [];
  projectStatus: any[] = [];
  recentActivity: any[] = [];

  constructor() {}

  ngOnInit() {
    this.loadDashboardData();
  }

  loadDashboardData() {
    // Aquí irían las llamadas a los servicios para cargar los datos
    // Por ahora usaremos datos de ejemplo
    this.activeProjects = 8;
    this.pendingTrackings = 5;
    this.weeklyReports = 12;
    this.activeDevelopers = 6;

    this.upcomingTrackings = [
      { projectName: 'ZIGI', developer: 'Andres Esquivel', date: new Date(), time: '10:00 AM' },
      { projectName: 'CRM', developer: 'Juan Pérez', date: new Date(), time: '2:30 PM' },
    ];

    this.projectStatus = [
      { name: 'ZIGI', progress: 75 },
      { name: 'CRM', progress: 45 },
      { name: 'ERP', progress: 90 },
    ];

    this.recentActivity = [
      { 
        description: 'Reporte enviado - Proyecto ZIGI',
        time: 'Hace 2 horas',
        iconClass: 'bg-green-500'
      },
      {
        description: 'Nuevo seguimiento creado - CRM',
        time: 'Hace 3 horas',
        iconClass: 'bg-blue-500'
      },
    ];
  }
} 