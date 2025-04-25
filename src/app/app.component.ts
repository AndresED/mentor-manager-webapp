import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="min-h-screen bg-gray-100">
      <nav class="bg-white shadow-md">
        <div class="container mx-auto px-4 py-2 flex justify-between items-center">
          <a routerLink="/" class="text-xl font-bold text-blue-600">Gestor de Proyectos</a>
          <div>
            <a routerLink="/projects" routerLinkActive="text-blue-600" class="mx-2 hover:text-blue-500">Proyectos</a>
            <a routerLink="/trackings" routerLinkActive="text-blue-600" class="mx-2 hover:text-blue-500">Seguimientos</a>
          </div>
        </div>
      </nav>
      
      <main class="container mx-auto py-4">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: []
})
export class AppComponent implements OnInit {
  constructor(private router: Router) {}
  
  ngOnInit(): void {
    // Monitorear las navegaciones para detectar redirecciones no deseadas
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      console.log('Navigation ended:', event.url);
      
      // Verificar si estamos en la ruta de detalle de seguimiento
      if (event.url.startsWith('/trackings/') && event.url !== '/trackings/new') {
        // Obtener el ID del seguimiento de la URL
        const trackingId = event.url.split('/trackings/')[1];
        
        // Verificar si hay un seguimiento con este ID
        if (trackingId) {
          console.log('Estamos en la página de detalle del seguimiento:', trackingId);
          
          // Aquí podríamos hacer alguna lógica adicional si es necesario
        }
      }
    });
  }
}
