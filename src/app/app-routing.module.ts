import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: '/projects', pathMatch: 'full' },
  {
    path: 'projects',
    loadChildren: () => import('./projects/projects.routes').then(m => m.PROJECTS_ROUTES)
  },
  {
    path: 'trackings',
    loadChildren: () => import('./tracking/tracking.routes').then(m => m.TRACKING_ROUTES)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    enableTracing: true // <-- Habilitar esto para depuración
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { } 