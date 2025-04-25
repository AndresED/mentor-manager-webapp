import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'projects', pathMatch: 'full' },
  {
    path: 'projects',
    loadChildren: () => import('./projects/projects.routes').then(m => m.PROJECTS_ROUTES)
  },
  {
    path: 'trackings',
    loadChildren: () => import('./tracking/tracking.routes').then(m => m.TRACKING_ROUTES)
  },
 /*  {
    path: 'reports',
    loadChildren: () => import('./reports/reports.routes').then(m => m.REPORTS_ROUTES)
  }, */
  {
    path: 'recipients',
    loadChildren: () => import('./recipients/recipients.module')
      .then(m => m.RecipientsModule)
  },
  { path: '**', redirectTo: 'projects' }
];
