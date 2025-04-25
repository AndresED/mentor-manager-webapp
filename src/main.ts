import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, Routes } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { AppComponent } from './app/app.component';
import { importProvidersFrom } from '@angular/core';
import { QuillModule } from 'ngx-quill';

// Importar estilos de Quill
import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';
import 'quill/dist/quill.bubble.css';

const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  {
    path: 'projects',
    loadChildren: () => import('./app/projects/projects.routes').then(m => m.PROJECTS_ROUTES)
  },
  {
    path: 'trackings',
    loadChildren: () => import('./app/tracking/tracking.routes').then(m => m.TRACKING_ROUTES)
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./app/dashboard/dashboard.routes').then(m => m.DASHBOARD_ROUTES)
  },
  {
    path: 'recipients',
    loadChildren: () => import('./app/recipients/recipients.routes').then(m => m.RECIPIENTS_ROUTES)
  }
];

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    importProvidersFrom(QuillModule.forRoot())
  ]
}).catch(err => console.error(err));
