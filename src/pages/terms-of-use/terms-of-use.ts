import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';

@IonicPage()
@Component({
  selector: 'page-terms-of-use',
  templateUrl: 'terms-of-use.html',
})
export class TermsOfUsePage {

  config;
  termsDE;
  termsEN;
  lang

  constructor(public navCtrl: NavController, public navParams: NavParams, private translate: TranslateService) {
  }

  ngOnInit() {
    console.log(this.navParams.data);
    this.config = this.navParams.data.config;
    this.lang = this.translate.currentLang;
    this.termsDE = this.config.tosTemplateDE;
    this.termsEN = this.config.tosTemplateEN;
  }

}
