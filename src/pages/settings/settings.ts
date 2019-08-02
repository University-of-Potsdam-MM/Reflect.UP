import { Storage } from '@ionic/storage';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { FormGroup, FormControl } from '@angular/forms';
import * as moment from 'moment';

@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {

  language: any;
  langForm;
  langs;
  hideTabBar = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, public translate: TranslateService, public storage: Storage) {
    this.language = translate.currentLang;
    if (this.navParams.data.hideTabBar) {
      this.hideTabBar = this.navParams.data.hideTabBar;
    }

    this.langForm = new FormGroup({
      "langs": new FormControl({ value: this.translate.currentLang, disabled: false })
    });
  }

  onChange(lang) {
    this.language = lang;
    this.translate.use(this.language);
    moment.locale(this.language);
    this.storage.set("appLanguage",this.language);
  }

}
