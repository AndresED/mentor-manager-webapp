export enum TrackingStatus {
  PENDING = 'Pendiente',
  IN_PROGRESS = 'En proceso',
  COMPLETED = 'Completado'
}

export interface Tracking {
  _id: string;
  projectId: string;
  name: string;
  description: string;
  status: TrackingStatus;
  developer: string;
  startDate: Date;
  endDate: Date;
  completedObjectives: string;
  pendingObjectives: string;
  observations: string;
  nextObjectives: string;
  coffeeBreaks: boolean;
  notesCoffeeBreaks?: string;
  codeReviews: boolean;
  notesCodeReviews?: string;
  pairProgramming: boolean;
  notesPairProgramming?: string;
  reportSent: boolean;
  weeklyMeetings: boolean;
  notesWeeklyMeetings?: string;
  incidents: string;
} 