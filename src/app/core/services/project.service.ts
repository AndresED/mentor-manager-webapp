import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface Project {
  _id: string;
  name: string;
  description: string;
  status: 'Activo' | 'Finalizado' | 'Parado' | 'Soporte';
  assignedDeveloper: string;
}

interface ApiProject {
  _id: string;
  name: string;
  description: string;
  status: string;
  assignedDeveloper: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private readonly apiUrl = environment.apiUrl ? `${environment.apiUrl}/projects` : 'http://localhost:3000/api/projects';
  private readonly projectsSubject = new BehaviorSubject<Project[]>([]);
  
  constructor(private readonly http: HttpClient) {
    // Cargar proyectos iniciales
    this.refreshProjects();
  }
  
  private refreshProjects(): void {
    this.getProjectsFromApi().subscribe(
      projects => this.projectsSubject.next(projects),
      error => console.error('Error al cargar proyectos:', error)
    );
  }
  
  private getProjectsFromApi(): Observable<Project[]> {
    return this.http.get<ApiProject[]>(this.apiUrl).pipe(
      map(projects => projects.map(project => ({
        _id: project._id,
        name: project.name,
        description: project.description,
        status: project.status as 'Activo' | 'Finalizado' | 'Parado' | 'Soporte',
        assignedDeveloper: project.assignedDeveloper
      }))),
      catchError(error => {
        console.error('Error fetching projects:', error);
        return this.simulateData();
      })
    );
  }
  
  getProjects(): Observable<Project[]> {
    return this.projectsSubject.asObservable();
  }
  
  getProjectById(id: string): Observable<Project> {
    return this.http.get<Project>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }
  
  createProject(project: Omit<Project, '_id'>): Observable<Project> {
    return this.http.post<Project>(this.apiUrl, project).pipe(
      catchError(error => {
        console.error('Error creating project:', error);
        // Simular creación exitosa
        const newProject: Project = {
          _id: Math.random().toString(36).substr(2, 9),
          ...project
        };
        return of(newProject);
      })
    );
  }
  
  updateProject(id: string, updates: Partial<Project>): Observable<Project> {
    return this.http.put<Project>(`${this.apiUrl}/${id}`, updates).pipe(
      tap(updatedProject => {
        const currentProjects = this.projectsSubject.value;
        const index = currentProjects.findIndex(p => p._id === id);
        if (index !== -1) {
          currentProjects[index] = updatedProject;
          this.projectsSubject.next([...currentProjects]);
        }
      }),
      catchError(this.handleError)
    );
  }
  
  deleteProject(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        const currentProjects = this.projectsSubject.value;
        this.projectsSubject.next(currentProjects.filter(p => p._id !== id));
      }),
      catchError(this.handleError)
    );
  }
  
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Ha ocurrido un error desconocido';
    
    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // El backend devolvió un código de error
      errorMessage = `Código: ${error.status}, Mensaje: ${error.error.message || error.statusText}`;
    }
    
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
  
  // Método para simular datos en caso de que la API no esté disponible
  simulateData(): Observable<Project[]> {
    const mockProjects: Project[] = [
      { 
        _id: '1', 
        name: 'Proyecto Demo 1', 
        description: 'Este es un proyecto de demostración', 
        status: 'Activo',
        assignedDeveloper: 'Juan Pérez' 
      },
      { 
        _id: '2', 
        name: 'Proyecto Demo 2', 
        description: 'Otro proyecto de ejemplo', 
        status: 'Parado',
        assignedDeveloper: 'María López' 
      },
      { 
        _id: '3', 
        name: 'Proyecto Demo 3', 
        description: 'Un tercer proyecto de prueba', 
        status: 'Finalizado',
        assignedDeveloper: 'Carlos Rodríguez' 
      },
      { 
        _id: '4', 
        name: 'Proyecto Demo 4', 
        description: 'Proyecto en soporte técnico', 
        status: 'Soporte',
        assignedDeveloper: 'Ana García' 
      }
    ];
    
    this.projectsSubject.next(mockProjects);
    return of(mockProjects);
  }
} 