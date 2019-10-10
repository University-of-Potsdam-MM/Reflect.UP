import { Component, ViewChildren, QueryList } from '@angular/core';
import { Platform, IonRouterOutlet, NavController, MenuController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { CacheService } from 'ionic-cache';
import { TranslateService } from '@ngx-translate/core';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';
import { PageInterface } from './lib/interfaces';
import * as moment from 'moment';
import { DomSanitizer } from '@angular/platform-browser';
import { ConfigService } from './services/config/config.service';
import { ISession } from './services/login-provider/interfaces';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {

  @ViewChildren(IonRouterOutlet) routerOutlets: QueryList<IonRouterOutlet>;

  pagesInMenu: PageInterface[];
  menuSetup = false;
  courseSessions: ISession[];
  mintEnabled;
  refreshingSessions;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private cache: CacheService,
    private translate: TranslateService,
    private storage: Storage,
    private router: Router,
    private sanitizer: DomSanitizer,
    private navCtrl: NavController,
    private menuCtrl: MenuController,
    private configService: ConfigService
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(async () => {
      if (this.platform.is('cordova')) {
        if (this.platform.is('android')) {
          this.listenToBackButton();
          this.statusBar.backgroundColorByHexString('#014260');
        } else { this.statusBar.styleDefault(); }

        this.splashScreen.hide();
      }

      await this.initializeSession();
      await this.initializeMenu();
      await this.initializeTranslate();

      this.cache.setDefaultTTL(7200);
      this.cache.setOfflineInvalidate(false);
    });
  }

  async initializeSession() {
    this.refreshingSessions = true;
    this.courseSessions = undefined;
    this.courseSessions = await this.storage.get('sessions');
    this.refreshingSessions = false;
  }

  async initializeTranslate() {
    this.translate.setDefaultLang('de');

    const userLanguage = await this.storage.get('appLanguage');
    if (userLanguage) {
      this.translate.use(userLanguage);
      moment.locale(userLanguage);
    } else {
      this.storage.set('appLanguage', 'de');
      moment.locale('de');
    }
  }

  async initializeMenu() {
    this.pagesInMenu = [
      { title: 'pageHeader.homePage_alt', pageName: '/home', icon: 'home' },
      { title: 'pageHeader.appointmentsPage_2', pageName: '/appointments', icon: 'calendar' },
      { title: 'pageHeader.questionsPage', pageName: '/questions', icon: 'create' },
      { title: 'pageHeader.contactsPage', pageName: '/contacts', icon: 'contacts' },
      { title: 'pageHeader.feedbackPage', pageName: '/feedback', icon: 'send' },
      { title: 'pageHeader.pushMessagesPage', pageName: '/push-messages', icon: 'chatbubbles'}
    ];

    this.courseSessions = await this.storage.get('sessions');
    if (this.courseSessions) {
      for (const session of this.courseSessions) {
        const config = this.configService.getConfigById(session.courseID);
        if (config.mintEnabled) {
          this.mintEnabled = true;
          break;
        }
      }
    }

    this.pagesInMenu.push({ title: 'pageHeader.settingsPage', pageName: '/settings', icon: 'settings'});
    this.pagesInMenu.push({ title: 'pageHeader.logoutPage', pageName: '/logout', icon: 'log-out' });
    this.menuSetup = true;
  }

  openPage(page: PageInterface) {
    this.menuCtrl.close();
    if (page.pageName !== this.router.url) {
      this.navCtrl.navigateBack('/home');
      if (page.pageName !== '/home') {
        setTimeout(() => {
          this.navCtrl.navigateForward(page.pageName);
        }, 1);
      }
    }
  }

  loginToNewCourses() {
    this.menuCtrl.close();
    this.navCtrl.navigateForward('/select-module');
  }

  changeSessionVisibility(session) {
    for (let i = 0; i < this.courseSessions.length; i++) {
      if (this.courseSessions[i].courseID === session.courseID) {
        this.courseSessions[i].isHidden = !this.courseSessions[i].isHidden;
        break;
      }
    }

    this.storage.set('sessions', this.courseSessions);
  }

  getHexColor(moduleConfig) {
    return this.sanitizer.bypassSecurityTrustStyle('color: ' + moduleConfig['hexColor']);
  }

  /**
   * listens to backbutton and closes application if backbutton is pressed on
   * home screen
   */
  listenToBackButton() {
    // workaround for #694
    // https://forum.ionicframework.com/t/hardware-back-button-with-ionic-4/137905/56
    this.platform.backButton.subscribe(async() => {
      this.routerOutlets.forEach(() => {
        if (this.router.url === '/home') {
          navigator['app'].exitApp();
        } else {
          window.history.back();
        }
      });
    });
  }
}
