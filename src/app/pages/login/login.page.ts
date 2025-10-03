import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonContent,
  IonInput,
  IonButton,
  IonCheckbox,
  IonIcon,
} from '@ionic/angular/standalone';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { addIcons } from 'ionicons';
import { eyeOutline, eyeOffOutline } from 'ionicons/icons';

import { AuthService } from '../../core/services/auth/auth.service';
import { FormUtilsService } from '../../utils/services/form-utils.service';
import { ToastService } from '../../utils/services/toast.service';
import { LoadingService } from '../../utils/services/loading.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslocoModule,
    IonContent,
    IonInput,
    IonButton,
    IonCheckbox,
    IonIcon,
  ],
})
export class LoginPage implements OnInit {
  loginForm!: FormGroup;
  showPassword = false;

  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);
  private readonly formUtils = inject(FormUtilsService);
  private readonly toastService = inject(ToastService);
  private readonly loadingService = inject(LoadingService);
  private readonly translocoService = inject(TranslocoService);

  ngOnInit(): void {
    addIcons({ eyeOutline, eyeOffOutline });
    this.initForm();
  }

  getErrorMessage(controlName: string): string {
    return this.formUtils.getErrorMessage(this.loginForm, controlName);
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  async onSubmit(): Promise<void> {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    await this.loadingService.present();

    const { email, password, keepSession } = this.loginForm.value;

    this.authService.login({ email, password }).subscribe({
      next: async () => {
        await this.loadingService.dismiss();
        await this.toastService.presentToastSuccess(
          this.translocoService.translate('AUTH.LOGIN_SUCCESS')
        );
        await this.router.navigate(['/home']);
      },
      error: async (error) => {
        await this.loadingService.dismiss();
        const errorMessage = error?.error?.message || this.translocoService.translate('AUTH.LOGIN_ERROR');
        await this.toastService.presentToastDanger(errorMessage);
      },
    });
  }

  goToRegister(): void {
    this.router.navigate(['/register']);
  }

  goToForgotPassword(): void {
    this.router.navigate(['/forgot-password']);
  }

  private initForm(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      keepSession: [false],
    });
  }
}
