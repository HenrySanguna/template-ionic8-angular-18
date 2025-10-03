import { inject, Injectable } from '@angular/core';
import { ToastButton, ToastOptions, ToastController } from '@ionic/angular/standalone';

type ToastPosition = 'top' | 'middle' | 'bottom';
type ToastColor = 'primary' | 'secondary' | 'tertiary' | 'success' | 'warning' | 'danger' | 'light' | 'dark';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private readonly toastController = inject(ToastController);

  async presentToast(options: ToastOptions): Promise<void> {
    const cssClass = options.cssClass 
      ? `${options.cssClass} multiline-toast` 
      : 'multiline-toast';
    
    const toast = await this.toastController.create({
      ...options,
      cssClass
    });
    
    await toast.present();
  }

  async presentToastWithButtons(
    message: string,
    position: ToastPosition = 'bottom',
    color: ToastColor = 'light',
    duration: number = 1500,
    buttons?: ToastButton[]
  ): Promise<void> {
    await this.presentToast({
      message,
      duration,
      position,
      color,
      buttons,
    });
  }

  async presentToastDanger(
    message: string,
    subMessage?: string,
    duration: number = 3000,
    position: ToastPosition = 'bottom'
  ): Promise<void> {
    await this.presentToast({ 
      message: subMessage ? `${message}\n${subMessage}` : message,
      duration, 
      position, 
      color: 'danger' 
    });
  }

  async presentToastWarning(
    message: string,
    subMessage?: string,
    duration: number = 1500,
    position: ToastPosition = 'bottom'
  ): Promise<void> {
    await this.presentToast({ 
      message: subMessage ? `${message}\n${subMessage}` : message,
      duration, 
      position, 
      color: 'warning' 
    });
  }

  async presentToastInfo(
    message: string,
    subMessage?: string,
    duration: number = 1500,
    position: ToastPosition = 'bottom'
  ): Promise<void> {
    await this.presentToast({ 
      message: subMessage ? `${message}\n${subMessage}` : message,
      duration, 
      position, 
      color: 'tertiary',
      cssClass: 'custom-toast-info',
    });
  }

  async presentToastSuccess(
    message: string,
    subMessage?: string,
    duration: number = 1500,
    position: ToastPosition = 'bottom'
  ): Promise<void> {
    await this.presentToast({ 
      message: subMessage ? `${message}\n${subMessage}` : message,
      duration, 
      position, 
      color: 'success' 
    });
  }
}