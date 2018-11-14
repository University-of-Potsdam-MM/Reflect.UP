import { Storage } from '@ionic/storage';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { IModuleConfig } from '../../lib/interfaces/config';
import { TranslateService } from '@ngx-translate/core';
import { PrivacyPolicyPage } from '../privacy-policy/privacy-policy';
import { LegalNoticePage } from '../legal-notice/legal-notice';
import { TermsOfUsePage } from '../terms-of-use/terms-of-use';

@IonicPage()
@Component({
  selector: 'page-impressum',
  templateUrl: 'impressum.html',
})
export class ImpressumPage {

  config;

  constructor(public navCtrl: NavController, public navParams: NavParams, public storage: Storage, public translate: TranslateService) {
  }

  ngOnInit() {
    this.storage.get("config").then(
      (config:IModuleConfig) => {
        if (config) {
          this.config = config;
        } else {
          this.storage.get("fallbackConfig").then((fConfig:IModuleConfig) => {
            if (fConfig) {
              this.config = fConfig;
            }
          })
        }
      }
    );
  }

  openPage(page) {
    console.log(this.config);
    if (page == "LegalNoticePage") {
      this.navCtrl.push(LegalNoticePage, { 'config': this.config });
    } else if (page == "PrivacyPolicyPage") {
      this.navCtrl.push(PrivacyPolicyPage, { 'config': this.config });
    } else {
      this.navCtrl.push(TermsOfUsePage, { 'config': this.config });
    }
  }

}
