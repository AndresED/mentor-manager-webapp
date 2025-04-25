import { Routes } from '@angular/router';
import { TrackingListComponent } from './components/tracking-list/tracking-list.component';
import { TrackingDetailComponent } from './components/tracking-detail/tracking-detail.component';
import { TrackingFormComponent } from './components/tracking-form/tracking-form.component';

export const TRACKING_ROUTES: Routes = [
  { path: '', component: TrackingListComponent },
  { path: 'new', component: TrackingFormComponent },
  { path: ':id', component: TrackingDetailComponent }
]; 