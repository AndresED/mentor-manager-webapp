import { Component, OnInit } from '@angular/core';
import { TrackingService } from '../core/services/tracking.service';
import { Tracking, TrackingStatus } from '../core/models/tracking.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tracking',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tracking.component.html',
  styleUrls: ['./tracking.component.css']
})
export class TrackingComponent implements OnInit {
  trackings: Tracking[] = [];
  TrackingStatus = TrackingStatus;

  constructor(private readonly trackingService: TrackingService) {}

  ngOnInit(): void {
    this.loadTrackings();
  }

  private loadTrackings(): void {
    this.trackingService.getTrackings().subscribe(
      trackings => this.trackings = trackings
    );
  }

  onSendReport(trackingId: string): void {
    this.trackingService.sendReport(trackingId).subscribe(
      success => {
        if (success) {
          this.loadTrackings();
        }
      }
    );
  }
} 