import { inject, Injectable, Type } from '@angular/core';
import { ModalController } from '@ionic/angular/standalone';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  private readonly modalController = inject(ModalController);

  async presentModal<T = unknown>(
    component: Type<unknown>,
    componentProps: Record<string, unknown> = {},
    breakpoints: number[] = [0, 0.5, 0.8, 1],
    initialBreakpoint: number = 0.5,
    cssClass: string = 'custom-modal'
  ): Promise<T | undefined> {
    const modal = await this.modalController.create({
      component,
      componentProps,
      breakpoints,
      initialBreakpoint,
      cssClass,
    });

    await modal.present();
    const { data } = await modal.onDidDismiss<T>();
    return data;
  }

  async presentSmallModal<T = unknown>(
    component: Type<unknown>,
    componentProps: Record<string, unknown> = {}
  ): Promise<T | undefined> {
    return this.presentModal<T>(component, componentProps, [0, 0.3, 0.5], 0.3);
  }

  async presentMediumModal<T = unknown>(
    component: Type<unknown>,
    componentProps: Record<string, unknown> = {}
  ): Promise<T | undefined> {
    return this.presentModal<T>(component, componentProps, [0, 0.5, 0.7], 0.5);
  }

  async presentFullScreenModal<T = unknown>(
    component: Type<unknown>,
    componentProps: Record<string, unknown> = {}
  ): Promise<T | undefined> {
    const modal = await this.modalController.create({
      component,
      componentProps,
      cssClass: 'fullscreen-modal',
      showBackdrop: true,
      backdropDismiss: true,
    });
    
    await modal.present();
    const { data } = await modal.onDidDismiss<T>();
    return data;
  }

  async presentAutoHeightModal<T = unknown>(
    component: Type<unknown>,
    componentProps: Record<string, unknown> = {}
  ): Promise<T | undefined> {
    const modal = await this.modalController.create({
      component,
      componentProps,
      cssClass: 'auto-height-modal',
    });
    
    await modal.present();
    const { data } = await modal.onDidDismiss<T>();
    return data;
  }

  async dismissModal<T = unknown>(data: T | null = null): Promise<boolean> {
    return this.modalController.dismiss(data);
  }
}
