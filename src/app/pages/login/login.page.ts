import { Component, OnInit } from '@angular/core';
import { ICredentials, ISession, ELoginErrors } from 'src/app/services/login-provider/interfaces';
import { Storage } from '@ionic/storage';
import { NavController, Platform } from '@ionic/angular';
import { DomSanitizer } from '@angular/platform-browser';
import { IModuleConfig } from 'src/app/lib/config';
import { Observable } from 'rxjs';
import { AlertService } from 'src/app/services/alert/alert.service';
import { TranslateService } from '@ngx-translate/core';
import { UPLoginProvider } from 'src/app/services/login-provider/login';
import * as dLoop from 'delayed-loop';
import { AppComponent } from 'src/app/app.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  loginCredentials: ICredentials;
  coursesToLogin: IModuleConfig[];

  hexValues = [
    // tslint:disable-next-line: max-line-length
    '#FFB74D', '#BA68C8', '#FFF176', '#7986CB', '#DCE775', '#4FC3F7', '#81C784', '#F06292', '#4DD0E1', '#4DB6AC', '#FF8A65', '#A1887F', '#90A4AE',
    // tslint:disable-next-line: max-line-length
    '#E65100', '#4A148C', '#FDD835', '#1A237E', '#827717', '#01579B', '#1B5E20', '#880E4F', '#006064', '#004D40', '#BF360C', '#3E2723', '#263238'
  ];

  constructor(
    private storage: Storage,
    private navCtrl: NavController,
    private sanitizer: DomSanitizer,
    private alert: AlertService,
    private translate: TranslateService,
    private platform: Platform,
    private UPLogin: UPLoginProvider,
    private app: AppComponent
  ) {
    this.loginCredentials = {username: '', password: ''};
  }

  ngOnInit() {
    this.getCoursesToLogin();
  }

  doLogin() {
    const loginSessions = [];

    const loop = dLoop(this.coursesToLogin, (itm, idx, fin) => {
      const config = itm;
      let method = config.authorization.method;
      if (!this.platform.is('cordova')) { method = 'credentials'; }

      // let online = await this.connection.checkOnlinePromise();
      const online = true;
      let sessionObs: Observable<ISession>;

      if (online) {
        this.coursesToLogin[idx]['isLoading'] = true;

        switch (method) {
          case 'credentials': {
            sessionObs = this.UPLogin.credentialsLogin(
              this.loginCredentials,
              config.authorization.credentials
            );
            break;
          }
          case 'sso': {
            sessionObs = this.UPLogin.ssoLogin(
              this.loginCredentials,
              config.authorization.sso
            );
            break;
          }
        }

        if (sessionObs) {
          sessionObs.subscribe((session: ISession) => {
            session.courseID = config.courseID;
            session.hexColor = config.hexColor;
            session.courseName = config.title;
            session.courseFac = config.faculty;

            loginSessions.push(session);
            this.coursesToLogin[idx]['isLoading'] = false;
            fin();
          }, error => {
            this.coursesToLogin[idx]['isLoading'] = 'ERROR';

            if (error.reason === ELoginErrors.AUTHENTICATION) {
              this.alert.showAlert({
                headerI18nKey: 'statusMessage.error.title',
                messageI18nKey: 'statusMessage.error.loginCredentials'
              }, [{ text: this.translate.instant('buttonLabel.ok') }]);
            } else {
              this.alert.showAlert({
                headerI18nKey: 'statusMessage.error.title',
                messageI18nKey: 'statusMessage.error.unknown'
              }, [{ text: this.translate.instant('buttonLabel.ok') }]);
            }

            fin();
          });
        } else {
          this.coursesToLogin[idx]['isLoading'] = 'ERROR';
          this.alert.showAlert({
            headerI18nKey: 'statusMessage.error.title',
            messageI18nKey: 'statusMessage.error.unknown'
          }, [{ text: this.translate.instant('buttonLabel.ok') }]);
          fin();
        }
      } else {
        this.alert.showAlert({
          headerI18nKey: 'statusMessage.error.title',
          messageI18nKey: 'statusMessage.error.network'
        }, [{ text: this.translate.instant('buttonLabel.ok') }]);
        fin();
      }
    });

    loop.then(() => {
      loginSessions.sort((a: ISession, b: ISession) => {
        const aName = a.courseName + ' ' + a.courseFac;
        const bName = b.courseName + ' ' + b.courseFac;

        if (aName.toLowerCase() < bName.toLowerCase()) { return -1; }
        if (aName.toLowerCase() > bName.toLowerCase()) { return 1; }
        return 0;
      });
      this.storage.set('sessions', loginSessions).finally(() => {
        this.app.initializeSession();
      });
      this.storage.remove('coursesToLogin');
      this.navCtrl.navigateRoot('/home');
    });
  }

  async getCoursesToLogin() {
    this.coursesToLogin = await this.storage.get('coursesToLogin');

    for (let i = 0; i < this.coursesToLogin.length; i++) {
      this.coursesToLogin[i]['hexColor'] = this.hexValues[i % this.hexValues.length];
    }
  }

  getHexColor(moduleConfig) {
    return this.sanitizer.bypassSecurityTrustStyle('color: ' + moduleConfig['hexColor']);
  }

  abortLogin() {
    this.navCtrl.navigateBack('/select-module');
  }

}
