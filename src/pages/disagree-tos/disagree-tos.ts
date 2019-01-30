import { TranslateService } from '@ngx-translate/core';
import { SelectModulePage } from './../select-module/select-module';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { IModuleConfig } from '../../lib/interfaces/config';
import { ImpressumPage } from '../impressum/impressum';
import { SettingsPage } from '../settings/settings';

@IonicPage()
@Component({
  selector: 'page-disagree-tos',
  templateUrl: 'disagree-tos.html',
})
export class DisagreeTosPage {

  tosMessageDE;
  tosMessageEN;

  constructor(public navCtrl: NavController, public navParams: NavParams, public menu: MenuController, public translate: TranslateService, public storage: Storage, public alertCtrl: AlertController) {
    // disable side menu so user can't access pages if ToS aren't accepted
    this.menu.enable(false,"sideMenu");
  }

  ngOnInit() {
    this.storage.get("fallbackConfig").then((config:IModuleConfig) => {
      if (config) {
        this.tosMessageDE = config.tosTemplateDE;
        this.tosMessageEN = config.tosTemplateEN;
      }
    });
  }

  tryTOSagain() {
    var msg;
    if (this.translate.currentLang == "de") {
      msg = this.tosMessageDE;
    } else { msg = this.tosMessageEN; }
    let alert = this.alertCtrl.create({
      title: this.translate.instant('statusMessage.tos.title'),
      message: msg,
      buttons: [
        {
          text: this.translate.instant('buttonLabel.disagree'),
          role: 'disagree',
          handler: () => {
            this.storage.set("ToS", "disagree");
          }
        },
        {
          text: this.translate.instant('buttonLabel.agree'),
          role: 'agree',
          handler: () => {
            this.storage.set("ToS", "agree");
            this.navCtrl.setRoot(SelectModulePage);
          }
        }
        ],
        enableBackdropDismiss: false,
      });
    alert.present();
  }

  openImpressum() {
    this.navCtrl.push(ImpressumPage);
  }

  openSettings() {
    this.navCtrl.push(SettingsPage, { hideTabBar: true });
  }

}
