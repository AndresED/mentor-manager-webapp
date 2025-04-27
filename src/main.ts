import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, Routes } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { AppComponent } from './app/app.component';
import { importProvidersFrom } from '@angular/core';
import { QuillModule } from 'ngx-quill';
import { AuthGuard } from './app/core/guards/auth.guard';
import { PublicGuard } from './app/core/guards/public.guard';
import { provideAnimations } from '@angular/platform-browser/animations';

// Importar estilos de Quill
import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';
import 'quill/dist/quill.bubble.css';
import { TokenInterceptor } from './app/core/interceptors/token.interceptor';
import { provideToastr } from 'ngx-toastr';
import { LoaderInterceptor } from './app/core/interceptors/loader.interceptor';

const routes: Routes = [
  {
    path: 'login',
    canActivate: [PublicGuard],
    loadChildren: () => import('./app/features/auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: '',
    canActivate: [AuthGuard],
    children: [
      {
        path: 'projects',
        loadChildren: () => import('./app/projects/projects.routes').then(m => m.PROJECTS_ROUTES)
      },
      {
        path: 'trackings',
        loadChildren: () => import('./app/tracking/tracking.routes').then(m => m.TRACKING_ROUTES)
      },
      {
        path: 'recipients',
        loadChildren: () => import('./app/recipients/recipients.routes').then(m => m.RECIPIENTS_ROUTES)
      },
      {
        path: '',
        redirectTo: 'projects',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
];

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([TokenInterceptor, LoaderInterceptor])),
    importProvidersFrom(QuillModule.forRoot()),
    provideAnimations(), // Requerido para las animaciones del toast
    provideToastr({
      timeOut: 3000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
      progressBar: true,
      closeButton: true,
      toastClass: 'ngx-toastr custom-toast',
      titleClass: 'toast-title',
      messageClass: 'toast-message'
    })
  ]
}).catch(err => console.error(err));

