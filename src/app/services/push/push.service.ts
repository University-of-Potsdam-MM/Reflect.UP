import { Injectable } from '@angular/core';
import { Platform, AlertController, NavController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { Push, PushOptions, PushObject } from '@ionic-native/push/ngx';
import { HTTP } from '@ionic-native/http/ngx';
import { IModuleConfig } from 'src/app/lib/config';
import { Storage } from '@ionic/storage';
import { ConfigService } from '../config/config.service';
import * as dLoop from 'delayed-loop';
import { ISession } from '../login-provider/interfaces';
import { Logger, LoggingService } from 'ionic-logging-service';

@Injectable({
  providedIn: 'root'
})
export class PushService {

  public global_registrationID = '';

  constructor(
    public platform: Platform,
    public push: Push,
    private alertCtrl: AlertController,
    private translate: TranslateService,
    private storage: Storage,
    private nativeHTTP: HTTP,
    private configService: ConfigService,
    private navCtrl: NavController,
    private loggingService: LoggingService
  ) { }

  createPushOptions(deviceID) {
    const tokenPayload = {
      device: null,
      token: deviceID,
      channel: 'default'
    };

    if (this.platform.is('ios')) {
      tokenPayload.device = 'ios';
    } else { tokenPayload.device = 'android'; }

    return tokenPayload;
  }

  subscribeToPush(registrationID, config: IModuleConfig, fin?) {

    const logger: Logger = this.loggingService.getLogger('[/push-service-subscribe]');

    logger.debug('subscribeToPush()', 'subscribing to push service for ' + config.courseID);

    // subscribe to the AirNotifier push service
    const url_subscribe = config.pushDetails.uniqushUrl.concat('tokens/');
    logger.debug('subscribeToPush()', 'registering push via ' + url_subscribe);

    const myData = this.createPushOptions(registrationID);
    logger.debug('subscribeToPush()', 'with payload ' + myData);

    let headerAppName = 'reflectup';
    headerAppName = headerAppName.concat(config.courseID.replace(/-/g, '').toLowerCase());
    const headerAppKey = config.pushDetails.XAnAppKey;

    const myHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': config.pushDetails.authHeader.accessToken,
      'X-An-App-Name': headerAppName,
      'X-An-App-Key': headerAppKey
    };

    this.nativeHTTP.setDataSerializer('json');
    this.nativeHTTP.post(url_subscribe, myData, myHeaders).then(() => {
      logger.debug('subscribeToPush()', 'successfully contacted the push server');

      if (fin) { fin(); }
    }).catch(error => {
      logger.error('subscribeToPush()', 'error while contacting the push server', error);

      if (fin) { fin(); }
    });

  }

  unsubscribeToPush(config: IModuleConfig) {
    const logger: Logger = this.loggingService.getLogger('[/push-service-unsubscribe]');

    // unsubscribe from the AirNotifier push service
    const url_unsubscribe = config.pushDetails.uniqushUrl.concat('tokens/') + this.global_registrationID;

    let headerAppName = 'reflectup';
    headerAppName = headerAppName.concat(config.courseID.replace(/-/g, '').toLowerCase());
    const headerAppKey = config.pushDetails.XAnAppKey;

    const myHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-AN-APP-NAME': headerAppName,
      'X-AN-APP-KEY': headerAppKey,
      'Authorization': config.pushDetails.authHeader.accessToken
    };

    this.nativeHTTP.setDataSerializer('json');
    this.nativeHTTP.delete(url_unsubscribe, {}, myHeaders).then(() => {
      logger.debug('unsubscribeToPush()', 'successfully unsubscribed from the push server');
    }).catch(error => {
      logger.error('unsubscribeToPush()', 'error while contacting the push server', error);
    });
  }

  async registerPushService() {
    const logger: Logger = this.loggingService.getLogger('[/push-service-register]');

    if (this.platform.is('android')) {
      await this.push.createChannel({
        id: 'PushPluginChannel',
        description: 'Reflect.UP Push',
        importance: 5,
        visibility: 1
      }).then(() => {
        logger.debug('registerPushService()', 'successfully created push channel');
      }, error => {
        logger.error('registerPushService()', 'push error on channel creation', error);
      });
    }

    const options: PushOptions = {
      android: {
        sound: true,
        vibrate: true,
        clearBadge: true
      },
      ios: {
        alert: true,
        badge: true,
        sound: true,
        voip: false,
        clearBadge: true
      }
    };

    const pushObject: PushObject = this.push.init(options);
    pushObject.on('notification').subscribe(async data => {

      // set default title if there is no title in push notification
      let title = 'Reflect.UP';
      if (data.title && data.title !== '') { title = data.title; }

      // only schedule an alert when notification is received while app in foreground
      logger.debug('registerPushService() on(notification)', 'received notification!', data);
      if (data.additionalData.foreground) {
        const alert = await this.alertCtrl.create({
          header: title,
          message: data.message,
          buttons: [
            {
              text: this.translate.instant('buttonLabel.ok'),
            },
            {
              text: this.translate.instant('buttonLabel.show'),
              handler: () => {
                this.navCtrl.navigateForward('/push-messages');
              }
            }
          ],
          backdropDismiss: false,
        });
        await alert.present();
      } else {
        this.navCtrl.navigateForward('/push-messages');
      }

      // calling pushObject.finish (necessary on iOS)
      if (this.platform.is('ios')) {
        pushObject.finish().catch((error) => {
          logger.error('registerPushService() finish()', 'error while processing background push', error);
        });
      }
    }, error => {
      logger.error('registerPushService() on(notification)', error);
    });

    pushObject.on('registration').subscribe(async data => {
      if (data.registrationId.length === 0) {
        logger.error('registerPushService() on(registration)', 'push registrationID is empty', data);
      } else {
        this.global_registrationID = data.registrationId;

        const sessions: ISession[] = await this.storage.get('sessions');
        if (sessions) {
          dLoop(sessions, (itm: ISession, idx, fin) => {
            if (itm) {
              const config = this.configService.getConfigById(itm.courseID);
              this.subscribeToPush(data.registrationId, config, fin);
            }
          });
        } else {
          logger.debug('registerPushService() on(registration)', 'user is not logged in; cant subscribe to push notifications');
        }
      }
    }, error => {
      logger.error('registerPushService() on(registration)', error);
    });

    pushObject.on('error').subscribe(data => {
      logger.debug('registerPushService() on(error)', data);
    }, error => {
      logger.error('registerPushService() on(error)', error);
    });
  }
}
