import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Recipient } from '../models/recipient.model';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class RecipientService {
  private readonly path = 'recipients';

  constructor(private readonly apiService: ApiService) {}

  getRecipients(): Observable<Recipient[]> {
    return this.apiService.get<Recipient[]>(this.path);
  }

  getRecipient(id: string): Observable<Recipient> {
    return this.apiService.get<Recipient>(`${this.path}/${id}`);
  }

  createRecipient(data: any): Observable<Recipient> {
    // Forzar la estructura exacta del objeto antes de enviarlo
    const recipient = {
      name: data.name,
      email: data.email,
      role: data.role,
      projects: data.projects
    };
    
    return this.apiService.post<Recipient, typeof recipient>(this.path, recipient);
  }

  updateRecipient(id: string, recipient: Partial<Recipient>): Observable<Recipient> {
    return this.apiService.put<Recipient, Partial<Recipient>>(`${this.path}/${id}`, recipient);
  }

  deleteRecipient(id: string): Observable<void> {
    return this.apiService.delete<void>(`${this.path}/${id}`);
  }
} 