import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const TokenInterceptor: HttpInterceptorFn = (
  request: HttpRequest<unknown>,
  next: HttpHandlerFn
) => {
  const authService = inject(AuthService);

  if (isPublicRequest(request)) {
    return next(request);
  }

  request = addToken(request, authService.getToken());

  return next(request).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        return handle401Error(request, next, authService);
      }
      return throwError(() => error);
    })
  );
};

function isPublicRequest(request: HttpRequest<unknown>): boolean {
  return (
    request.url.includes('auth/login') ||
    request.url.includes('auth/refresh-token')
  );
}

function addToken(request: HttpRequest<unknown>, token: string | null): HttpRequest<unknown> {
  if (token) {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }
  return request;
}

function handle401Error(request: HttpRequest<unknown>, next: HttpHandlerFn, authService: AuthService) {
  return authService.refreshToken().pipe(
    switchMap(tokens => {
      return next(addToken(request, tokens.accessToken));
    }),
    catchError(error => {
      authService.logout();
      return throwError(() => error);
    })
  );
} 