import { inject, Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular/standalone';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private readonly loadingController = inject(LoadingController);
  private loading: HTMLIonLoadingElement | null = null;

  async present(spinner: 'bubbles' | 'circles' | 'crescent' | 'dots' = 'bubbles'): Promise<void> {
    if (this.loading) {
      await this.dismiss();
    }
    
    this.loading = await this.loadingController.create({ spinner });
    await this.loading.present();
  }

  async dismiss(): Promise<void> {
    if (this.loading) {
      try {
        await this.loading.dismiss();
        this.loading = null;
      } catch (error) {
        console.error('Error al ocultar el loading:', error);
        this.loading = null;
      }
    }
  }

  isPresenting(): boolean {
    return this.loading !== null;
  }
}
