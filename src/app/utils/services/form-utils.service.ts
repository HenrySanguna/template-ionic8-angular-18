import { inject, Injectable } from '@angular/core';
import { AbstractControl, FormControl, FormGroup } from '@angular/forms';
import { TranslocoService } from '@jsverse/transloco';

@Injectable({
  providedIn: 'root'
})
export class FormUtilsService {
  private readonly transloco = inject(TranslocoService);

  getFormControl(formControl: FormGroup, name: string): FormControl {
    return formControl.get(name) as FormControl;
  }

  getFormError(
    formControl: FormGroup | AbstractControl,
    controlName?: string
  ): boolean {
    let control: AbstractControl | null;

    if (formControl instanceof FormGroup && controlName) {
      control = formControl.get(controlName);
    } else if (!(formControl instanceof FormGroup)) {
      control = formControl;
    } else {
      return false;
    }
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  getErrorMessage(
    formControl: FormGroup | AbstractControl,
    controlName?: string,
    controlType?: string
  ): string {
    let control: AbstractControl | null;

    if (formControl instanceof FormGroup && controlName) {
      control = formControl.get(controlName);
    } else if (!(formControl instanceof FormGroup)) {
      control = formControl;
    } else {
      return '';
    }
    
    if (!control || !control.errors) return '';

    const name = (controlName || '').toLowerCase();
    const isPasswordCtrl = controlType === 'password' || name.includes('password');
    const isConfirmCtrl = name.includes('confirm');

    if (control.errors['required']) {
      return this.transloco.translate('ERRORS.REQUIRED');
    }

    if (control.errors['email']) {
      return this.transloco.translate('ERRORS.EMAIL');
    }
    
    if (control.errors['strictEmail']) {
      return this.transloco.translate('ERRORS.STRICT_EMAIL');
    }
    
    if (control.errors['emailTaken']) {
      return this.transloco.translate('ERRORS.EMAIL_TAKEN');
    }

    if (control.errors['minlength']) {
      const requiredLength = control.errors['minlength'].requiredLength;
      if (isPasswordCtrl) {
        return this.transloco.translate('ERRORS.MINLENGTH_PASSWORD', { requiredLength });
      }
      return this.transloco.translate('ERRORS.MINLENGTH', { requiredLength });
    }
    
    if (control.errors['maxlength']) {
      const requiredLength = control.errors['maxlength'].requiredLength;
      return this.transloco.translate('ERRORS.MAXLENGTH', { requiredLength });
    }

    if (isPasswordCtrl) {
      if (control.errors['noUppercase']) {
        return this.transloco.translate('ERRORS.PASSWORD_UPPERCASE');
      }
      if (control.errors['noLowercase']) {
        return this.transloco.translate('ERRORS.PASSWORD_LOWERCASE');
      }
      if (control.errors['noDigit']) {
        return this.transloco.translate('ERRORS.PASSWORD_DIGIT');
      }
    }

    if (control.errors['pattern']) {
      if (controlType === 'phone' || name.includes('phone') || name.includes('telefono')) {
        return this.transloco.translate('ERRORS.PATTERN_PHONE');
      }
      if (isPasswordCtrl) {
        return this.transloco.translate('ERRORS.PASSWORD_PATTERN');
      }
      return this.transloco.translate('ERRORS.PATTERN');
    }

    if (control.errors['min']) {
      return this.transloco.translate('ERRORS.MIN');
    }
    
    if (control.errors['max']) {
      return this.transloco.translate('ERRORS.MAX');
    }

    if (control.errors['custom']) {
      return this.transloco.translate('ERRORS.CUSTOM', { custom: control.errors['custom'] });
    }

    if (isConfirmCtrl && control.errors['passwordMismatch']) {
      return this.transloco.translate('ERRORS.PASSWORDS_NOT_MATCH');
    }
    
    if (control.errors['mustMatch']) {
      return this.transloco.translate('ERRORS.MUST_MATCH');
    }

    return this.transloco.translate('ERRORS.INVALID');
  }
}
