import { Routes } from '@angular/router';
import { ProjectListComponent } from './components/project-list/project-list.component';
import { ProjectDetailComponent } from './components/project-detail/project-detail.component';
import { ProjectFormComponent } from './components/project-form/project-form.component';

export const PROJECTS_ROUTES: Routes = [
  { path: '', component: ProjectListComponent },
  { path: 'new', component: ProjectFormComponent },
  { path: ':id', component: ProjectDetailComponent }
]; 