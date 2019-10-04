import { Component, OnInit } from '@angular/core';
import { ISession } from 'src/app/services/login-provider/interfaces';
import { Storage } from '@ionic/storage';
import { DomSanitizer } from '@angular/platform-browser';
import { CacheService } from 'ionic-cache';
import { Platform, NavController } from '@ionic/angular';
import { PushService } from 'src/app/services/push/push.service';
import { IModuleConfig } from 'src/app/lib/config';
import { ConfigService } from 'src/app/services/config/config.service';
import { AppComponent } from 'src/app/app.component';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.page.html',
  styleUrls: ['./logout.page.scss'],
})
export class LogoutPage implements OnInit {

  sessions: ISession[];

  constructor(
    private storage: Storage,
    private sanitizer: DomSanitizer,
    private cache: CacheService,
    private platform: Platform,
    private push: PushService,
    private navCtrl: NavController,
    private configService: ConfigService,
    private app: AppComponent
  ) { }

  async ngOnInit() {
    this.sessions = await this.storage.get('sessions');
  }

  getHexColor(session: ISession) {
    return this.sanitizer.bypassSecurityTrustStyle('color: ' + session.hexColor);
  }

  /**
   * performLogout
   *
   * unsets current session, thus logging the user out
   */
  performLogout() {
    const newSessionObject: ISession[] = [];

    if (this.sessions) {
      for (const session of this.sessions) {
        if (session['isChecked']) {
          if (this.platform.is('cordova')) {
            const config: IModuleConfig = this.configService.getConfigById(session.courseID);
            this.push.unsubscribeToPush(config);
          }
        } else {
          newSessionObject.push(session);
        }
      }

      this.cache.clearAll();
      if (newSessionObject.length > 0) {
        newSessionObject.sort((a: ISession, b: ISession) => {
          const aName = a.courseName + ' ' + a.courseFac;
          const bName = b.courseName + ' ' + b.courseFac;

          if (aName.toLowerCase() < bName.toLowerCase()) { return -1; }
          if (aName.toLowerCase() > bName.toLowerCase()) { return 1; }
          return 0;
        });
        this.storage.set('sessions', newSessionObject).finally(() => {
          this.app.initializeSession();
        });
        this.navCtrl.navigateRoot('/home');
      } else {
        this.storage.set('sessions', undefined).finally(() => {
          this.app.initializeSession();
        });
        this.navCtrl.navigateRoot('/select-module');
      }

    }
  }

  isModuleSelected() {
    let moduleSelected = false;

    if (this.sessions) {
      for (const session of this.sessions) {
        if (session['isChecked']) {
          moduleSelected = true;
          break;
        }
      }
    }

    return !moduleSelected;
  }

}
