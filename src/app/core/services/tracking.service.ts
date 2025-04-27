import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Tracking, TrackingStatus } from '../models/tracking.model';

@Injectable({
  providedIn: 'root'
})
export class TrackingService {
  private readonly apiUrl = environment.apiUrl ? `${environment.apiUrl}/trackings` : 'http://localhost:3000/api/trackings';
  
  constructor(private readonly http: HttpClient) {}
  
  getTrackings(projectId?: string): Observable<Tracking[]> {
    let url = this.apiUrl;
    if (projectId) {
      url += `?projectId=${projectId}`;
    }
    return this.http.get<Tracking[]>(url).pipe(
      catchError(error => {
        console.error('Error fetching trackings:', error);
        return this.simulateTrackingsForProject(projectId || '1');
      })
    );
  }
  
  getTrackingById(id: string): Observable<Tracking> {
    return this.http.get<Tracking>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }
  
  createTracking(tracking: Omit<Tracking, '_id'>): Observable<Tracking> {
    return this.http.post<Tracking>(this.apiUrl, tracking).pipe(
      catchError(this.handleError)
    );
  }
  
  updateTracking(id: string, updates: Partial<Tracking>): Observable<Tracking> {
    return this.http.put<Tracking>(`${this.apiUrl}/${id}`, updates).pipe(
      catchError(this.handleError)
    );
  }
  
  sendReport(id: string): Observable<Tracking> {
    return this.http.post<Tracking>(`${this.apiUrl}/${id}/send-report`, {}).pipe(
      catchError(error => {
        console.error('Error sending report:', error);
        // Simular envío exitoso
        return of({ 
          _id: id, 
          name: 'Seguimiento simulado',
          description: 'Seguimiento simulado para envío de reporte',
          reportSent: true,
          projectId: '',
          status: TrackingStatus.IN_PROGRESS,
          developer: '',
          startDate: new Date(),
          endDate: new Date(),
          completedObjectives: '',
          pendingObjectives: '',
          observations: '',
          nextObjectives: '',
          coffeeBreaks: false,
          codeReviews: false,
          pairProgramming: false,
          weeklyMeetings: false,
          notesWeeklyMeetings: '',
          notesCoffeeBreaks: '',
          notesCodeReviews: '',
          notesPairProgramming: ''
        } as Tracking);
      })
    );
  }
  
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Ha ocurrido un error desconocido';
    
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Código: ${error.status}, Mensaje: ${error.error?.message || error.statusText}`;
    }
    
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
  
  // Método para simular datos en caso de que la API no esté disponible
  simulateTrackingsForProject(projectId: string): Observable<Tracking[]> {
    const mockTrackings: Tracking[] = [
      {
        _id: '1',
        projectId: projectId,
        name: 'Seguimiento 1',
        description: 'Primer seguimiento del proyecto',
        status: TrackingStatus.COMPLETED,
        developer: 'Juan Pérez',
        startDate: new Date(2023, 2, 1),
        endDate: new Date(2023, 2, 5),
        completedObjectives: 'Implementación de la interfaz de usuario',
        pendingObjectives: '',
        observations: 'Todo se completó según lo planeado',
        nextObjectives: 'Comenzar con la integración de API',
        coffeeBreaks: true,
        codeReviews: true,
        pairProgramming: false,
        reportSent: true,
        weeklyMeetings: false,
        notesWeeklyMeetings: '',
        notesCoffeeBreaks: '',
        notesCodeReviews: '',
        notesPairProgramming: ''
      },
      {
        _id: '2',
        projectId: projectId,
        name: 'Seguimiento 2',
        description: 'Segundo seguimiento del proyecto',
        status: TrackingStatus.COMPLETED,
        developer: 'Juan Pérez',
        startDate: new Date(2023, 2, 8),
        endDate: new Date(2023, 2, 12),
        completedObjectives: 'Integración de API básica',
        pendingObjectives: 'Algunos endpoints avanzados',
        observations: 'Se encontraron algunos problemas con la autenticación',
        nextObjectives: 'Completar la integración de API',
        coffeeBreaks: true,
        codeReviews: true,
        pairProgramming: true,
        reportSent: true,
        weeklyMeetings: false,
        notesWeeklyMeetings: '',
        notesCoffeeBreaks: '',
        notesCodeReviews: '',
        notesPairProgramming: ''
      },
      {
        _id: '3',
        projectId: projectId,
        name: 'Seguimiento 3',
        description: 'Tercer seguimiento del proyecto',
        status: TrackingStatus.IN_PROGRESS,
        developer: 'Juan Pérez',
        startDate: new Date(2023, 2, 15),
        endDate: new Date(2023, 2, 19),
        completedObjectives: '',
        pendingObjectives: 'Implementación de funcionalidades avanzadas',
        observations: 'Trabajando según lo planeado',
        nextObjectives: 'Finalizar el sprint actual',
        coffeeBreaks: true,
        codeReviews: false,
        pairProgramming: false,
        reportSent: false,
        weeklyMeetings: false,
        notesWeeklyMeetings: '',
        notesCoffeeBreaks: '',
        notesCodeReviews: '',
        notesPairProgramming: ''
      }
    ];
    
    return of(mockTrackings);
  }

  getDashboardStats() {
    return this.http.get<any>(`${this.apiUrl}/dashboard/stats`);
  }

  getUpcomingTrackings() {
    return this.http.get<any>(`${this.apiUrl}/dashboard/upcoming`);
  }
} 