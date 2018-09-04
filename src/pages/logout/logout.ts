import { PushProvider } from '../../providers/push-provider/push-provider';
import { SelectModulePage } from './../select-module/select-module';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { IModuleConfig } from '../../lib/interfaces/config';

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
    private platform: Platform
  ) {
  }

  /**
   * performLogout
   *
   * unsets current session, thus logging the user out
   */
  public performLogout(): void {

    this.storage.set("session", null);
    this.storage.set("config", null);
    this.storage.set("pushRegistered", "no");
    if (this.platform.is("ios") || this.platform.is("android")) {
      // use actual courseID in the future
      this.storage.get("config").then(
        (config:IModuleConfig) => {
          if (config) {
            this.pushProv.unsubscribeToPush(config);
          }
        }
      );
    }
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
