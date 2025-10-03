import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { AuthService } from '../services/auth/auth.service';

/**
 * Guard para rutas públicas (login, register).
 * Redirige a home si el usuario ya está autenticado.
 */
export const publicGuard: CanActivateFn = () => {
  const router = inject(Router);
  const authService = inject(AuthService);

  return authService.hasAccessToken().pipe(
    map((hasToken) => {
      if (hasToken) {
        router.navigate(['/home']);
        return false;
      }
      return true;
    }),
    catchError(() => of(true))
  );
};
