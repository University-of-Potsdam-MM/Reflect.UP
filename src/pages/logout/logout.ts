import { PushProvider } from '../../providers/push-provider/push-provider';
import { SelectModulePage } from './../select-module/select-module';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { IModuleConfig } from '../../lib/interfaces/config';
import { CacheService } from 'ionic-cache';

/**
 * LogoutPage
 *
 * contains form for Logout and logout logic
 */
@IonicPage()
@Component({
  selector: 'page-logout',
  templateUrl: 'logout.html',
})
export class LogoutPage {

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public storage: Storage,
    private pushProv: PushProvider,
    private platform: Platform,
    private cache: CacheService
  ) {
  }

  /**
   * performLogout
   *
   * unsets current session, thus logging the user out
   */
  performLogout() {
    if (this.platform.is("cordova")) {
      this.storage.get("config").then((config:IModuleConfig) => {
        if (config) {
          this.pushProv.unsubscribeToPush(config);
          this.storage.set("config", null);
        }
      });
    } else { this.storage.set("config", null); }

    this.cache.clearAll();
    this.storage.set("session", null);
    this.storage.set("pushRegistered", false);
    this.navCtrl.setRoot(SelectModulePage);
  }

  /**
   * goHome
   *
   * sends the user to HomePage (defaults to HomePage)
   */
  public goHome(){
    this.navCtrl.popToRoot();
  }

}
