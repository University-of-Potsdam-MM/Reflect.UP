import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { TranslateService } from '@ngx-translate/core';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

  language;

  constructor(
    private translate: TranslateService,
    private storage: Storage
  ) { }

  ngOnInit() {
    this.language = this.translate.currentLang;
  }

  onChange(lang) {
    this.language = lang;
    this.translate.use(this.language);
    moment.locale(this.language);
    this.storage.set('appLanguage', this.language);
  }

}
