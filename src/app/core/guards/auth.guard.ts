import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    // Verificar si el usuario está autenticado
    const isAuthenticated = true; // Cambia esto según tu lógica de autenticación
    
    if (!isAuthenticated) {
      this.router.navigate(['/login']);
      return false;
    }
    
    return true;
  }
} 