import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs';
import { LoaderService } from '../services/loader.service';

export const LoaderInterceptor: HttpInterceptorFn = (req, next) => {
  const loaderService = inject(LoaderService);
  
  // No mostrar loader para refresh token
  if (req.url.includes('refresh-token')) {
    return next(req);
  }

  loaderService.show();
  
  return next(req).pipe(
    finalize(() => {
      loaderService.hide();
    })
  );
}; 