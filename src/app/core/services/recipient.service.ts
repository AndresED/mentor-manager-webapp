import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Recipient } from '../models/recipient.model';

@Injectable({
  providedIn: 'root'
})
export class RecipientService {
  private path = 'recipients';

  constructor(private apiService: ApiService) {}

  getRecipients(): Observable<Recipient[]> {
    return this.apiService.get<Recipient[]>(this.path);
  }

  getRecipient(id: string): Observable<Recipient> {
    return this.apiService.get<Recipient>(`${this.path}/${id}`);
  }

  createRecipient(recipient: Partial<Recipient>): Observable<Recipient> {
    return this.apiService.post<Recipient, Partial<Recipient>>(this.path, recipient);
  }

  updateRecipient(id: string, recipient: Partial<Recipient>): Observable<Recipient> {
    return this.apiService.put<Recipient, Partial<Recipient>>(`${this.path}/${id}`, recipient);
  }

  deleteRecipient(id: string): Observable<boolean> {
    return this.apiService.delete<boolean>(`${this.path}/${id}`);
  }
} 