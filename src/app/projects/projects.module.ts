import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PROJECTS_ROUTES } from './projects.routes';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(PROJECTS_ROUTES)
  ],
  exports: [RouterModule]
})
export class ProjectsModule { } 