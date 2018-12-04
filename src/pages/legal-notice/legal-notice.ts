import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { IModuleConfig } from '../../lib/interfaces/config';

@IonicPage()
@Component({
  selector: 'page-legal-notice',
  templateUrl: 'legal-notice.html',
})
export class LegalNoticePage {

  config:IModuleConfig;
  impressumDE;
  impressumEN;
  lang;

  constructor(public navCtrl: NavController, public navParams: NavParams, private translate: TranslateService) {
  }

  ngOnInit() {
    this.config = this.navParams.data.config;
    this.lang = this.translate.currentLang;
    this.impressumDE = this.config.impressumTemplateDE;
    this.impressumEN = this.config.impressumTemplateEN;
  }

}
