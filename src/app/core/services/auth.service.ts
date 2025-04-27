import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import { ApiService } from './api.service';

export interface User {
  _id: string;
  email: string;
  name: string;
  role: string;
}

export interface LoginResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly path = 'auth';
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;
  private refreshTokenTimeout?: any;

  constructor(
    private apiService: ApiService,
    private router: Router
  ) {
    this.currentUserSubject = new BehaviorSubject<User | null>(this.getUserFromStorage());
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  login(email: string, password: string): Observable<User> {
    return this.apiService.post<LoginResponse, {email: string, password: string}>(
      `${this.path}/login`, 
      { email, password }
    ).pipe(
      tap(response => this.setSession(response)),
      map(response => response.user)
    );
  }

  logout(): void {
    // Intentar revocar el token actual
    const token = this.getToken();
    if (token) {
      this.apiService.post(`${this.path}/revoke-token`, { token })
        .pipe(catchError(() => throwError(() => 'Error al revocar el token')))
        .subscribe();
    }

    this.clearSession();
    this.router.navigate(['/login']);
  }

  refreshToken(): Observable<TokenResponse> {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      return throwError(() => 'No refresh token available');
    }

    return this.apiService.post<TokenResponse, {refreshToken: string}>(
      `${this.path}/refresh-token`,
      { refreshToken }
    ).pipe(
      tap(tokens => {
        localStorage.setItem('token', tokens.accessToken);
        localStorage.setItem('refreshToken', tokens.refreshToken);
        this.startRefreshTokenTimer();
      })
    );
  }

  private setSession(response: LoginResponse): void {
    localStorage.setItem('token', response.accessToken);
    localStorage.setItem('refreshToken', response.refreshToken);
    localStorage.setItem('user', JSON.stringify(response.user));
    this.currentUserSubject.next(response.user);
    this.startRefreshTokenTimer();
  }

  private clearSession(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    this.currentUserSubject.next(null);
    this.stopRefreshTokenTimer();
  }

  private getUserFromStorage(): User | null {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isAuthenticated(): boolean {
    return !!this.currentUserValue && !!this.getToken();
  }

  private startRefreshTokenTimer(): void {
    // Refrescar el token 1 minuto antes de que expire
    const token = this.getToken();
    if (token) {
      const jwtToken = JSON.parse(atob(token.split('.')[1]));
      const expires = new Date(jwtToken.exp * 1000);
      const timeout = expires.getTime() - Date.now() - (60 * 1000);
      this.refreshTokenTimeout = setTimeout(() => this.refreshToken().subscribe(), timeout);
    }
  }

  private stopRefreshTokenTimer(): void {
    if (this.refreshTokenTimeout) {
      clearTimeout(this.refreshTokenTimeout);
    }
  }
} 