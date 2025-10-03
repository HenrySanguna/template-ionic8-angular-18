import { inject, Injectable } from '@angular/core';
import {
  ActionSheetController,
  ActionSheetOptions,
  AlertController,
  AlertOptions
} from '@ionic/angular/standalone';

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  private readonly actionSheetController = inject(ActionSheetController);
  private readonly alertController = inject(AlertController);

  async presentActionSheet(options: ActionSheetOptions): Promise<void> {
    const actionSheet = await this.actionSheetController.create(options);
    await actionSheet.present();
  }

  async presentAlert(options: AlertOptions): Promise<void> {
    const alert = await this.alertController.create(options);
    await alert.present();
  }

  async dismissActionSheet(): Promise<boolean> {
    return this.actionSheetController.dismiss();
  }

  async dismissAlert(): Promise<boolean> {
    return this.alertController.dismiss();
  }
}
