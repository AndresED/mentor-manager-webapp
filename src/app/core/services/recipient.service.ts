import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Recipient } from '../models/recipient.model';

@Injectable({
  providedIn: 'root'
})
export class RecipientService {
  private apiUrl = `${environment.apiUrl}/recipients`;

  constructor(private http: HttpClient) {}

  getRecipients(): Observable<Recipient[]> {
    return this.http.get<Recipient[]>(this.apiUrl);
  }

  getRecipient(id: string): Observable<Recipient> {
    return this.http.get<Recipient>(`${this.apiUrl}/${id}`);
  }

  createRecipient(data: any): Observable<any> {
    // Forzar la estructura exacta del objeto antes de enviarlo
    const recipient = {
      name: data.name,
      email: data.email,
      role: data.role,
      projects: data.projects
    };
    
    return this.http.post<any>(this.apiUrl, recipient);
  }

  updateRecipient(id: string, recipient: Partial<Recipient>): Observable<Recipient> {
    return this.http.put<Recipient>(`${this.apiUrl}/${id}`, recipient);
  }

  deleteRecipient(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
} 