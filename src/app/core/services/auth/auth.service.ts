import { inject, Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { NavController } from '@ionic/angular/standalone';
import {
  catchError,
  map,
  Observable,
  of,
  switchMap,
  throwError,
} from 'rxjs';
import { StorageKey, UserData } from '../../interfaces/storage';
import {
  DataLogin,
  EmailCheckResponse,
  LoginResponse,
  PasswordResetConfirmation,
  PasswordResetRequest,
  RefreshTokenResponse
} from '../../interfaces/auth';
import { ApiCallService } from '../api-call.service';
import { StorageService } from '../storage.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly basePath = '/auth';
  private readonly platform = Capacitor.getPlatform();

  private readonly apiCallService = inject(ApiCallService);
  private readonly navCtrl = inject(NavController);
  private readonly storageService = inject(StorageService);

  hasAccessToken(): Observable<boolean> {
    return this.storageService.get(StorageKey.accessToken).pipe(
      map((token) => token !== null),
      catchError(() => of(false))
    );
  }

  login(credentials: DataLogin): Observable<boolean> {
    return this.apiCallService.post<LoginResponse>(`${this.basePath}/login`, credentials).pipe(
      switchMap((response) => {
        const { token, refreshToken, user } = response.data;
        
        return this.storageService.set(StorageKey.accessToken, token).pipe(
          switchMap(() => this.storageService.set(StorageKey.refreshToken, refreshToken)),
          switchMap(() => this.storageService.set(StorageKey.userData, user)),
          map(() => true)
        );
      }),
      catchError((error) => {
        console.error('Error en login:', error.message);
        return throwError(() => error);
      })
    );
  }

  recoverPassword(email: string): Observable<any> {
    const payload: PasswordResetRequest = {
      email,
      platform: this.platform,
      appScheme: 'cz-cars',
    };

    return this.apiCallService.post(`${this.basePath}/resetPasswordEmail`, payload).pipe(
      catchError((error) => {
        console.error('Error en recoverPassword:', error);
        return throwError(() => error);
      })
    );
  }

  logout(): Observable<void> {
    return this.storageService.clear().pipe(
      switchMap(() => {
        this.navCtrl.navigateRoot('/login');
        return of(void 0);
      }),
      catchError((error) => {
        console.error('Error al hacer logout:', error);
        return of(void 0);
      })
    );
  }

  checkTokenValidity(): Observable<boolean> {
    return this.storageService.get(StorageKey.accessToken).pipe(
      map((accessToken) => {
        if (!accessToken) {
          return false;
        }
        
        const decodedToken = this.decodeToken(accessToken);
        const accessTokenExpiration = decodedToken.exp * 1000;
        const nowTimeStamp = Date.now();
        
        return nowTimeStamp < accessTokenExpiration;
      }),
      catchError(() => of(false))
    );
  }

  register(formData: any): Observable<any> {
    return this.apiCallService.post(`${this.basePath}/register`, formData).pipe(
      catchError((error) => {
        console.error('Error en registro:', error);
        return throwError(() => error);
      })
    );
  }

  confirmPasswordReset(token: string, newPassword: string): Observable<any> {
    const payload: PasswordResetConfirmation = { token, password: newPassword };
    
    return this.apiCallService.post(`${this.basePath}/setNewPassword`, payload).pipe(
      catchError((error) => {
        console.error('Error al confirmar restablecimiento de contraseña:', error);
        return throwError(() => error);
      })
    );
  }

  updatePassword(oldPassword: string, newPassword: string): Observable<any> {
    return this.storageService.get(StorageKey.accessToken).pipe(
      switchMap((token) => {
        if (!token) {
          return throwError(() => new Error('Token no disponible'));
        }

        return this.apiCallService.post(
          `${this.basePath}/updatePassword`,
          { oldPassword, newPassword }
        );
      }),
      catchError((error) => {
        console.error('Error al actualizar contraseña:', error);
        return throwError(() => error);
      })
    );
  }

  deleteAccount(): Observable<any> {
    return this.storageService.get(StorageKey.userData).pipe(
      switchMap((userData) => {
        if (!userData?.id) {
          return throwError(() => new Error('Datos de usuario no disponibles'));
        }
        
        return this.apiCallService.delete(`/user/${userData.id}`);
      }),
      switchMap(() => this.logout()),
      catchError((error) => {
        console.error('Error al eliminar cuenta:', error);
        return throwError(() => error);
      })
    );
  }

  isEmailTaken(email: string): Observable<boolean> {
    return this.apiCallService.post<EmailCheckResponse>(`${this.basePath}/emailExists`, { email }).pipe(
      map((response) => response.data),
      catchError((error) => {
        console.error('Error al verificar email:', error);
        return of(false);
      })
    );
  }

  refreshToken(): Observable<string> {
    return this.storageService.get(StorageKey.refreshToken).pipe(
      switchMap((refreshToken) => {
        if (!refreshToken) {
          this.navCtrl.navigateRoot('/login');
          return throwError(() => new Error('Refresh token no disponible'));
        }
        
        return this.apiCallService.post<RefreshTokenResponse>(
          `${this.basePath}/refreshToken`,
          { refreshToken }
        ).pipe(
          map((response) => response.data.access_token),
          switchMap((newToken) => 
            this.storageService.set(StorageKey.accessToken, newToken).pipe(
              map(() => newToken)
            )
          )
        );
      }),
      catchError((error) => {
        console.error('Error al refrescar token:', error);
        this.logout().subscribe();
        return throwError(() => error);
      })
    );
  }

  getUserData(): Observable<UserData | null> {
    return this.storageService.get(StorageKey.userData);
  }

  private decodeToken(token: string): any {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Error al decodificar token:', error);
      return {};
    }
  }
}
