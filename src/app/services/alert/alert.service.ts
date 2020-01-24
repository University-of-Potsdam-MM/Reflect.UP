import { Injectable } from '@angular/core';
import { AlertController, NavController, ToastController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { AlertButton } from '@ionic/core';
import { Logger, LoggingService } from 'ionic-logging-service';

/**
 * @type {IAlertOptions}
 */
export interface IAlertOptions {
  headerI18nKey?: string;
  messageI18nKey?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  currentAlert = undefined;

  /**
   * @constructor
   * @param {AlertController} alertCtrl
   * @param {TranslateService} translate
   * @param {NavController} navCtrl
   */
  constructor(
    private alertCtrl: AlertController,
    private translate: TranslateService,
    private navCtrl: NavController,
    private toastCtrl: ToastController,
    private loggingService: LoggingService
  ) { }

  /**
   * @name showAlert
   * @description shows alert as specified by alertOptions parameter
   * @param {IAlertOptions} alertOptions
   */
  async showAlert(alertOptions: IAlertOptions, buttons?: AlertButton[], textMessage?: string, cantBeSupressed?: boolean) {

    let alertButtons: AlertButton[] = [];
    if (buttons) { alertButtons = buttons; } else {
      alertButtons = [
        {
          text: this.translate.instant('pageHeader.homePage_alt'),
          handler: () => {
            this.navCtrl.navigateRoot('/home');
            this.currentAlert = undefined;
          }
        },
        {
          text: this.translate.instant('buttonLabel.next'),
          handler: () => {
            this.currentAlert = undefined;
          }
        }
      ];
    }

    const logger: Logger = this.loggingService.getLogger('[/alert-service]');

    let message = this.translate.instant(alertOptions.messageI18nKey);
    if (textMessage) { message = textMessage; }

    const headerMessage = alertOptions.headerI18nKey ? this.translate.instant(alertOptions.headerI18nKey) : undefined;
    // only show new alert if no other alert is currently open
    if (!this.currentAlert || cantBeSupressed) {
      this.currentAlert = await this.alertCtrl.create({
        header: headerMessage,
        message: message,
        backdropDismiss: false,
        buttons: alertButtons
      }).catch(error => logger.error('showAlert', error));

      this.currentAlert.present();
      await this.currentAlert.onDidDismiss();
      this.currentAlert = undefined;
    } else { logger.debug('showAlert', 'another alert is shown'); }
  }

  /**
   * @name presentToast
   * @param message
   */
  async showToast(messageI18nKey) {
    const toast = await this.toastCtrl.create({
      message: this.translate.instant(messageI18nKey),
      duration: 2000,
      position: 'top',
      cssClass: 'toastPosition'
    });
    toast.present();
  }
}
