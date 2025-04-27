import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { map } from 'rxjs/operators';

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private readonly http: HttpClient) {}

  get<T>(path: string, params: HttpParams = new HttpParams()): Observable<T> {
    return this.http.get<ApiResponse<T>>(`${this.apiUrl}/${path}`, { params })
      .pipe(map(response => response.data));
  }

  post<T, D>(path: string, data: D): Observable<T> {
    return this.http.post<ApiResponse<T>>(`${this.apiUrl}/${path}`, data)
      .pipe(map(response => response.data));
  }

  put<T, D>(path: string, data: D): Observable<T> {
    return this.http.put<ApiResponse<T>>(`${this.apiUrl}/${path}`, data)
      .pipe(map(response => response.data));
  }

  delete<T>(path: string): Observable<T> {
    return this.http.delete<ApiResponse<T>>(`${this.apiUrl}/${path}`)
      .pipe(map(response => response.data));
  }
} 