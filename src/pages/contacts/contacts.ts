import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { IModuleConfig } from '../../lib/interfaces/config';
import { Storage } from '@ionic/storage';

@IonicPage()
@Component({
  selector: 'page-contacts',
  templateUrl: 'contacts.html',
})
export class ContactsPage {

  public configStorageKey = "config";
  public selectedModule: IModuleConfig = null;
  showLevel1 = null;
  showLevel2 = null;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public storage: Storage
    ) {
  }

  ngOnInit() {
    this.storage.get(this.configStorageKey).then((config:IModuleConfig) => {
      if (config) {
        this.selectedModule = config;
      }
    });
  }

  toggleLevel1(idx) {
    if (this.isLevel1Shown(idx)) {
      this.showLevel1 = null;
      this.showLevel2 = null;
    } else {
      this.showLevel1 = idx;
      this.showLevel2 = null;
    }
  }

  toggleLevel2(idx) {
    if (this.isLevel2Shown(idx)) {
      this.showLevel2 = null;
    } else {
      this.showLevel2 = idx;
    }
  }

  isLevel1Shown(idx) {
    return this.showLevel1 === idx;
  }

  isLevel2Shown(idx) {
    return this.showLevel2 === idx;
  }

}
