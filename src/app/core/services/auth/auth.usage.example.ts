/**
 * EJEMPLO DE USO DEL AUTH SERVICE REFACTORIZADO
 * Este archivo muestra cómo usar el AuthService actualizado
 */

import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { AlertService, LoadingService, ToastService } from 'src/app/utils/services';
import { DataLogin } from '../../interfaces';

@Component({
  selector: 'app-auth-example',
  template: ''
})
export class AuthExampleComponent implements OnInit {
  private auth = inject(AuthService);
  private loading = inject(LoadingService);
  private toast = inject(ToastService);
  private alert = inject(AlertService);
  private fb = inject(FormBuilder);
  private destroy$ = new Subject<void>();

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  ngOnInit(): void {
    this.checkAuthStatus();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Ejemplo 1: Login
  async onLogin() {
    if (this.loginForm.invalid) {
      await this.toast.presentToastWarning('Formulario inválido');
      return;
    }

    await this.loading.present();

    const credentials: DataLogin = {
      email: this.loginForm.value.email!,
      password: this.loginForm.value.password!
    };

    this.auth.login(credentials)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: async (success) => {
          await this.loading.dismiss();
          if (success) {
            await this.toast.presentToastSuccess('Sesión iniciada');
            // El servicio navega automáticamente
          }
        },
        error: async (error) => {
          await this.loading.dismiss();
          await this.toast.presentToastDanger(
            'Error al iniciar sesión',
            error.message
          );
        }
      });
  }

  // Ejemplo 2: Verificar autenticación
  checkAuthStatus(): void {
    // Verificar si existe token
    this.auth.hasAccessToken()
      .pipe(takeUntil(this.destroy$))
      .subscribe(hasToken => {
        console.log('Tiene token:', hasToken);
      });

    // Verificar si el token es válido
    this.auth.checkTokenValidity()
      .pipe(takeUntil(this.destroy$))
      .subscribe(isValid => {
        console.log('Token válido:', isValid);
        if (!isValid) {
          // Intentar refrescar el token
          this.refreshAuthToken();
        }
      });
  }

  // Ejemplo 3: Refresh token
  refreshAuthToken(): void {
    this.auth.refreshToken()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (newToken) => {
          console.log('Token actualizado');
        },
        error: (error) => {
          console.error('No se pudo refrescar el token:', error);
          // El servicio ya navega al login automáticamente
        }
      });
  }

  // Ejemplo 4: Obtener datos del usuario
  async getUserInfo() {
    this.auth.getUserData()
      .pipe(takeUntil(this.destroy$))
      .subscribe(user => {
        if (user) {
          console.log('Usuario:', user.name, user.email);
          console.log('ID:', user.id);
        } else {
          console.log('No hay datos de usuario');
        }
      });
  }

  // Ejemplo 5: Logout
  async onLogout() {
    await this.alert.presentAlert({
      header: 'Cerrar sesión',
      message: '¿Estás seguro de que deseas salir?',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Salir',
          handler: () => {
            this.auth.logout()
              .pipe(takeUntil(this.destroy$))
              .subscribe({
                next: () => {
                  // El servicio limpia storage y navega al login
                  this.toast.presentToastSuccess('Sesión cerrada');
                }
              });
          }
        }
      ]
    });
  }

  // Ejemplo 6: Registro de usuario
  async onRegister() {
    const registerData = {
      email: 'nuevo@example.com',
      password: 'password123',
      name: 'Nuevo Usuario'
    };

    await this.loading.present();

    this.auth.register(registerData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: async (response) => {
          await this.loading.dismiss();
          await this.toast.presentToastSuccess(
            'Registro exitoso',
            'Ya puedes iniciar sesión'
          );
        },
        error: async (error) => {
          await this.loading.dismiss();
          await this.toast.presentToastDanger('Error en el registro', error.message);
        }
      });
  }

  // Ejemplo 7: Recuperar contraseña
  async onRecoverPassword() {
    await this.alert.presentAlert({
      header: 'Recuperar contraseña',
      inputs: [
        {
          name: 'email',
          type: 'email',
          placeholder: 'Ingresa tu email'
        }
      ],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Enviar',
          handler: (data) => {
            if (data.email) {
              this.sendPasswordReset(data.email);
            }
          }
        }
      ]
    });
  }

  private sendPasswordReset(email: string): void {
    this.loading.present();

    this.auth.recoverPassword(email)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: async () => {
          await this.loading.dismiss();
          await this.toast.presentToastSuccess(
            'Email enviado',
            'Revisa tu bandeja de entrada'
          );
        },
        error: async (error) => {
          await this.loading.dismiss();
          await this.toast.presentToastDanger('Error', error.message);
        }
      });
  }

  // Ejemplo 8: Confirmar reset de contraseña
  confirmNewPassword(token: string, newPassword: string): void {
    this.loading.present();

    this.auth.confirmPasswordReset(token, newPassword)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: async () => {
          await this.loading.dismiss();
          await this.toast.presentToastSuccess('Contraseña actualizada');
        },
        error: async (error) => {
          await this.loading.dismiss();
          await this.toast.presentToastDanger('Error', error.message);
        }
      });
  }

  // Ejemplo 9: Actualizar contraseña desde perfil
  async onUpdatePassword() {
    await this.alert.presentAlert({
      header: 'Cambiar contraseña',
      inputs: [
        { name: 'oldPassword', type: 'password', placeholder: 'Contraseña actual' },
        { name: 'newPassword', type: 'password', placeholder: 'Nueva contraseña' }
      ],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Cambiar',
          handler: (data) => {
            if (data.oldPassword && data.newPassword) {
              this.updateUserPassword(data.oldPassword, data.newPassword);
            }
          }
        }
      ]
    });
  }

  private updateUserPassword(oldPassword: string, newPassword: string): void {
    this.loading.present();

    this.auth.updatePassword(oldPassword, newPassword)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: async () => {
          await this.loading.dismiss();
          await this.toast.presentToastSuccess('Contraseña actualizada');
        },
        error: async (error) => {
          await this.loading.dismiss();
          await this.toast.presentToastDanger('Error', error.message);
        }
      });
  }

  // Ejemplo 10: Eliminar cuenta
  async onDeleteAccount() {
    await this.alert.presentAlert({
      header: 'Eliminar cuenta',
      message: '¿Estás seguro? Esta acción no se puede deshacer.',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: () => {
            this.loading.present();

            this.auth.deleteAccount()
              .pipe(takeUntil(this.destroy$))
              .subscribe({
                next: async () => {
                  await this.loading.dismiss();
                  await this.toast.presentToastSuccess('Cuenta eliminada');
                  // El servicio ya cierra sesión y navega automáticamente
                },
                error: async (error) => {
                  await this.loading.dismiss();
                  await this.toast.presentToastDanger('Error', error.message);
                }
              });
          }
        }
      ]
    });
  }

  // Ejemplo 11: Validar email en tiempo real (registro)
  checkEmailAvailability(email: string): void {
    this.auth.isEmailTaken(email)
      .pipe(takeUntil(this.destroy$))
      .subscribe(isTaken => {
        if (isTaken) {
          console.log('Email ya registrado');
          // Mostrar error en el formulario
        } else {
          console.log('Email disponible');
        }
      });
  }
}
