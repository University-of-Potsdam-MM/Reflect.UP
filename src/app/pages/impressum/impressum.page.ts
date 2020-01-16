import { Component, OnInit } from '@angular/core';
import { NavController, Platform } from '@ionic/angular';
import { AbstractPage } from '../abstract-page';
import { EmailComposer } from '@ionic-native/email-composer/ngx';
import { File } from '@ionic-native/file/ngx';
import { Storage } from '@ionic/storage';
import { Device } from '@ionic-native/device/ngx';
import { ConfigService } from 'src/app/services/config/config.service';

@Component({
  selector: 'app-impressum',
  templateUrl: './impressum.page.html',
  styleUrls: ['./impressum.page.scss'],
})
export class ImpressumPage extends AbstractPage implements OnInit {

  constructor(
    private navCtrl: NavController,
    private file: File,
    private emailComposer: EmailComposer,
    private platform: Platform,
    private storage: Storage,
    private device: Device
  ) {
    super();
  }

  ngOnInit() { }

  openPage(page) {
    if (page === 'LegalNoticePage') {
      this.navCtrl.navigateForward('/legal-notice');
    } else if (page === 'PrivacyPolicyPage') {
      this.navCtrl.navigateForward('/privacy-policy');
    } else {
      this.navCtrl.navigateForward('/terms-of-service');
    }
  }

  async exportLog() {
    if (this.platform.is('cordova')) {
      const deviceInfo = this.getDeviceInfo();
      deviceInfo.appVersion = await this.storage.get('appVersion');
      const body = JSON.stringify(deviceInfo);
      const subject = 'Reflect.UP Log Export (' + new Date().toLocaleString() + ')';

      this.file.writeFile(this.file.cacheDirectory, 'log.txt', localStorage.getItem('localLogStorage'), { replace: true })
        .then(response => {
          this.logger.debug('exportLog', response);
          const email = {
            to: 'mobileup-service@uni-potsdam.de',
            attachments: [ this.file.cacheDirectory + 'log.txt' ],
            body: body,
            subject: subject,
            isHtml: true
          };

          this.emailComposer.open(email).then(res => this.logger.debug('exportLog', res),
            error => this.logger.error('exportLog', 'open email', error));
        }, error => this.logger.error('exportLog', 'write file', error));
    } else { console.log(JSON.parse(localStorage.getItem('localLogStorage'))); }
  }

  /**
   * @name getDeviceInfo
   * @description get information about the device
   */
  getDeviceInfo() {
    if (this.platform.is('cordova')) {
      const deviceInfo = {
        cordovaVersion: this.device.cordova,
        appVersion: ConfigService.configs[0].appVersion,
        osPlatform: this.device.platform,
        osVersion: this.device.version,
        uuid: this.device.uuid,
        deviceManufacturer: this.device.manufacturer,
        deviceModel: this.device.model
      };
      return deviceInfo;
    } else { return null; }
  }

}
