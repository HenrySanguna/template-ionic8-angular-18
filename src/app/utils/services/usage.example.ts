/**
 * EJEMPLO DE USO DE LOS SERVICIOS
 */

import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  AlertService,
  FormUtilsService,
  LoadingService,
  ModalService,
  ToastService,
} from '../services';

@Component({
  selector: 'app-example',
  template: '',
})
export class ExampleUsageComponent implements OnInit {
  private formUtils = inject(FormUtilsService);
  private loading = inject(LoadingService);
  private alert = inject(AlertService);
  private toast = inject(ToastService);
  private modal = inject(ModalService);
  private fb = inject(FormBuilder);

  loginForm!: FormGroup;

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  // Ejemplo 1: Validación de formularios
  getEmailError(): string {
    return this.formUtils.getErrorMessage(this.loginForm, 'email', 'email');
  }

  hasEmailError(): boolean {
    return this.formUtils.getFormError(this.loginForm, 'email');
  }

  // Ejemplo 2: Loading
  async login(): Promise<void> {
    await this.loading.present('bubbles');

    try {
      // Simular login
      await this.fakeApiCall();

      await this.toast.presentToastSuccess('Login exitoso');
    } catch (error) {
      await this.toast.presentToastDanger('Error al iniciar sesión');
    } finally {
      await this.loading.dismiss();
    }
  }

  // Ejemplo 3: Alert
  async showConfirmDialog(): Promise<void> {
    await this.alert.presentAlert({
      header: 'Confirmar',
      message: '¿Estás seguro?',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        { text: 'Aceptar', handler: () => this.deleteAccount() },
      ],
    });
  }

  // Ejemplo 4: Action Sheet
  async showOptions(): Promise<void> {
    await this.alert.presentActionSheet({
      header: 'Opciones',
      buttons: [
        { text: 'Editar', icon: 'create', handler: () => this.edit() },
        {
          text: 'Eliminar',
          icon: 'trash',
          role: 'destructive',
          handler: () => this.delete(),
        },
        { text: 'Cancelar', icon: 'close', role: 'cancel' },
      ],
    });
  }

  // Ejemplo 5: Toast
  async showSuccessMessage(): Promise<void> {
    await this.toast.presentToastSuccess(
      'Operación exitosa',
      'Los datos se guardaron correctamente'
    );
  }

  async showErrorMessage(): Promise<void> {
    await this.toast.presentToastDanger(
      'Error',
      'No se pudieron guardar los datos',
      3000
    );
  }

  // Ejemplo 6: Modal
  async openUserModal(): Promise<void> {
    const result = await this.modal.presentMediumModal(
      {} as any, // Reemplazar con tu componente
      { userId: 123 }
    );

    if (result) {
      console.log('Datos del modal:', result);
    }
  }

  // Métodos auxiliares
  private async fakeApiCall(): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, 2000));
  }

  private deleteAccount(): void {
    console.log('Cuenta eliminada');
  }

  private edit(): void {
    console.log('Editando...');
  }

  private delete(): void {
    console.log('Eliminando...');
  }
}
