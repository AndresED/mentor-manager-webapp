import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'projects',
    loadChildren: () => import('./projects/projects.module')
      .then(m => m.ProjectsModule)
  },
  {
    path: 'tracking',
    loadChildren: () => import('./tracking/tracking.module')
      .then(m => m.TrackingModule)
  },
  {
    path: 'recipients',
    loadChildren: () => import('./recipients/recipients.module')
      .then(m => m.RecipientsModule)
  },
  { path: '', redirectTo: 'projects', pathMatch: 'full' },
  { path: '**', redirectTo: 'projects' }
];
