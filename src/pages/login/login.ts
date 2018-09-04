import { IModuleConfig } from '../../lib/interfaces/config';
import { HomePage } from './../home/home';
import { Component } from '@angular/core';
import { IonicPage, NavController, Loading, LoadingController, AlertController, MenuController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { SelectModulePage } from '../select-module/select-module';
import { ConnectionProvider } from '../../providers/connection-provider/connection-provider';
import { TranslateService } from '@ngx-translate/core';
import { ICredentials, ISession, ELoginErrors } from '../../providers/login-provider/interfaces';
import { UPLoginProvider } from '../../providers/login-provider/login';
import { ImpressumPage } from '../impressum/impressum';
import { SettingsPage } from '../settings/settings';
import { Observable } from 'rxjs/Observable';

/**
 * LoginPage
 *
 * contains form for login and login logic
 */
@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  private configStorageKey = "config";
  private loading: Loading;
  public loginCredentials: ICredentials;

  constructor(
      private navCtrl:     NavController,
      private loadingCtrl: LoadingController,
      private alertCtrl:   AlertController,
      private storage:     Storage,
      private connection:  ConnectionProvider,
      private translate:   TranslateService,
      private upLogin:     UPLoginProvider,
      private menu:        MenuController) {

    this.menu.enable(false,"sideMenu");
    this.resetCredentials();
  }

  /**
   * resetCredentials
   *
   * resets the credentials model
   */
  private resetCredentials() {
    this.loginCredentials = {username: '', password: ''};
  }

  /**
   * login
   *
   * performs login when submit button has been pressed
   */
  public async login() : Promise<void> {

    let online = await this.connection.checkOnlinePromise();
    let config:IModuleConfig = await this.storage.get(this.configStorageKey);

    let method = config.authorization.method;

    // prepare Observable for use in switch
    let session:Observable<ISession> = null;

    if (online) {

      this.showLoading();

      switch(method) {
        case "credentials": {
          session = this.upLogin.credentialsLogin(
            this.loginCredentials,
            config.authorization.credentials
          );
          break;
        }
        case "sso": {
          session = this.upLogin.ssoLogin(
            this.loginCredentials,
            config.authorization.sso
          );
          break;
        }
      }

      if (session) {
        // now handle the Observable which hopefully contains a session
        session.subscribe((session:ISession) => {
          // console.log("[LoginPage]: Login successfully executed. Token:", session.token);
          this.storage.set("session", session);
          this.endLoading();
          this.navCtrl.setRoot(HomePage, {fromSideMenu: true});
        }, error => {
          console.log(error);
          this.endLoading();
          if (error.reason == ELoginErrors.AUTHENTICATION) {
            this.showAlert("statusMessage.error.loginCredentials");
          } else {
            this.showAlert("statusMessage.error.unknown");
          }
        });
      } else {
        this.showAlert("statusMessage.error.unknown");
        console.log("[LoginPage]: Somehow no session has been passed by login-provider");
      }
      
    } else {
      // there is no network connection
      this.endLoading();
      this.showAlert("statusMessage.error.network");
    }
  }

  /**
   * abort
   *
   * cancels login process and send user back to module selection
   */
  public abort(){
    this.navCtrl.setRoot(SelectModulePage);
  }

  /**
   * showLoading
   *
   * shows a loading animation
   */
  private showLoading(): void {
    this.loading = this.loadingCtrl.create({
      content: this.translate.instant("statusMessage.login.running"),
      dismissOnPageChange: true,
      spinner: "crescent"
    });
    this.loading.present();
  }

  /**
   * endLoading
   *
   * ends the loading animation
   */
  private endLoading(): void {
    this.loading.dismiss();
  }

  /**
   * showAlert
   *
   * shows an alert fitting the passed state
   */
  private showAlert(alertTextKey:string): void {
    let alert = this.alertCtrl.create({
      title: this.translate.instant("statusMessage.error.title"),
      subTitle: this.translate.instant(alertTextKey),
      buttons: [
        this.translate.instant("buttonLabel.ok")
      ]
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
