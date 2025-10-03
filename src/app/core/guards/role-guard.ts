import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { NavController } from '@ionic/angular/standalone';
import { map, catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { TranslocoService } from '@jsverse/transloco';
import { AuthService } from '../services/auth/auth.service';
import { ToastService } from '../../utils/services/toast.service';

/**
 * Guard para verificar roles de usuario.
 * Uso: { path: 'admin', canActivate: [authGuard, roleGuard], data: { roles: ['admin', 'superadmin'] } }
 * Si el usuario no tiene el rol requerido, muestra un toast y vuelve a la página anterior.
 */
export const roleGuard: CanActivateFn = (route) => {
  const navCtrl = inject(NavController);
  const authService = inject(AuthService);
  const toastService = inject(ToastService);
  const transloco = inject(TranslocoService);

  const requiredRoles = route.data['roles'] as string[] | undefined;

  if (!requiredRoles || requiredRoles.length === 0) {
    return true;
  }

  return authService.getUserData().pipe(
    map((userData) => {
      if (!userData) {
        navCtrl.navigateRoot('/login');
        return false;
      }

      const userRole = userData['role'] as string | undefined;
      
      if (!userRole || !requiredRoles.includes(userRole)) {
        return false;
      }

      return true;
    }),
    tap((hasPermission) => {
      if (!hasPermission) {
        toastService.presentToastWarning(
          transloco.translate('ERRORS.INSUFFICIENT_PERMISSIONS'),
          transloco.translate('ERRORS.INSUFFICIENT_PERMISSIONS_MESSAGE')
        );
        navCtrl.back();
      }
    }),
    catchError(() => {
      navCtrl.navigateRoot('/login');
      return of(false);
    })
  );
};
