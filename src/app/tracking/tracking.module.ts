import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TRACKING_ROUTES } from './tracking.routes';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(TRACKING_ROUTES)
  ],
  exports: [RouterModule]
})
export class TrackingModule { } 