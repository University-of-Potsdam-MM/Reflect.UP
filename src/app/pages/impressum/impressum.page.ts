import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { IModuleConfig } from 'src/app/lib/config';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-impressum',
  templateUrl: './impressum.page.html',
  styleUrls: ['./impressum.page.scss'],
})
export class ImpressumPage implements OnInit {

  config;

  constructor(
    private storage: Storage,
    private navCtrl: NavController
  ) { }

  ngOnInit() {
    this.storage.get('config').then(
      (config: IModuleConfig) => {
        if (config) {
          this.config = config;
        } else {
          this.storage.get('fallbackConfig').then((fConfig: IModuleConfig) => {
            if (fConfig) {
              this.config = fConfig;
            }
          });
        }
      }
    );
  }

  openPage(page) {
    if (page === 'LegalNoticePage') {
      this.navCtrl.navigateForward('/legal-notice');
    } else if (page === 'PrivacyPolicyPage') {
      this.navCtrl.navigateForward('/privacy-policy');
    } else {
      this.navCtrl.navigateForward('/terms-of-service');
    }
  }

}
