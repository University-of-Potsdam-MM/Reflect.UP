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
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { SafariViewController } from '@ionic-native/safari-view-controller/ngx';
import { PushService } from './services/push/push.service';
import { IModuleConfig } from './lib/config';
import { HttpParams, HttpHeaders, HttpClient } from '@angular/common/http';
import { HomePage } from './pages/home/home.page';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {

  @ViewChildren(IonRouterOutlet) routerOutlets: QueryList<IonRouterOutlet>;

  pagesInMenu: PageInterface[];
  menuSetup = false;
  courseSessions: ISession[];
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
    private pushService: PushService,
    private navCtrl: NavController,
    private menuCtrl: MenuController,
    private configService: ConfigService,
    private inAppBrowser: InAppBrowser,
    private http: HttpClient,
    private safariOrChrome: SafariViewController,
    private home: HomePage
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      if (this.platform.is('cordova')) {
        if (this.platform.is('android')) {
          this.listenToBackButton();
          this.statusBar.backgroundColorByHexString('#014260');
        } else { this.statusBar.styleDefault(); }

        this.splashScreen.hide();
      }

      this.initializeSession();
      this.initializeMenu();
      this.initializeTranslate();
      this.enrollMoodleCourses();

      if (this.platform.is('cordova')) {
        this.startPushRegistration();
      }

      this.cache.setDefaultTTL(7200);
      this.cache.setOfflineInvalidate(false);
    });
  }

  async startPushRegistration() {
    if (this.platform.is('cordova')) {
      this.pushService.registerPushService();
    }
  }

  async enrollMoodleCourses() {
    this.courseSessions = await this.storage.get('sessions');

    if (this.courseSessions) {
      for (let i = 0; i < this.courseSessions.length; i++) {
        const config: IModuleConfig = this.configService.getConfigById(this.courseSessions[i].courseID);
        this.enrollSelf(config, this.courseSessions[i].token);
      }
    }
  }

  async initializeSession() {
    this.refreshingSessions = true;
    this.courseSessions = undefined;
    this.courseSessions = await this.storage.get('sessions');

    if (!this.courseSessions) {
      const sessionPreVersion7 = await this.storage.get('session');
      if (sessionPreVersion7) {
        console.log('Old Session: ');
        console.log(sessionPreVersion7);
      } else {
        console.log('No old session found.');
      }

      const configPreVersion7 = await this.storage.get('config');
      if (configPreVersion7) {
        console.log('Old Config: ');
        console.log(configPreVersion7);
      } else {
        console.log('No old config found.');
      }

      let courseStillAvailable;
      if (configPreVersion7) {
        courseStillAvailable = this.configService.getConfigById(configPreVersion7.courseID);
        if (courseStillAvailable) {
          console.log('Course Still Available: ');
          console.log(courseStillAvailable);
        } else {
          console.log('Old course is not available anymore.');
        }
      }

      if (!sessionPreVersion7 || !configPreVersion7 || !courseStillAvailable) {
        this.storage.remove('session');
        this.storage.remove('config');
        this.navCtrl.navigateRoot('/select-module');
      } else {
        const newSessionArray: ISession[] = [];

        const newSession: ISession = {
          token: sessionPreVersion7.token,
          courseID: configPreVersion7.courseID,
          courseName: configPreVersion7.title,
          courseFac: configPreVersion7.faculty,
          hexColor: '#FFB74D',
          isHidden: false
        };

        newSessionArray.push(newSession);
        this.courseSessions = newSessionArray;
        this.storage.set('sessions', newSessionArray).then(() => {
          this.initializeMenu();
        });
        this.storage.remove('session');
        this.storage.remove('config');
      }
    }

    this.refreshingSessions = false;
  }

  enrollSelf(config: IModuleConfig, token) {
    const moodleAccessPoint = config.moodleServiceEndpoint;
    const accessToken = config.authorization.credentials.authHeader.accessToken;
    const courseID = config.courseID;
    const wstoken = token;

    const params: HttpParams = new HttpParams()
      .append('wstoken', wstoken)
      .append('wsfunction', 'local_reflect_enrol_self')
      .append('moodlewsrestformat', 'json')
      .append('courseID', courseID);

    const headers: HttpHeaders = new HttpHeaders()
      .append('Authorization', accessToken);

    this.http.get(moodleAccessPoint, {headers: headers, params: params}).subscribe(() => { });
  }

  async initializeTranslate() {
    this.translate.setDefaultLang('de');

    const userLanguage = await this.storage.get('appLanguage');
    if (userLanguage) {
      this.translate.use(userLanguage);
      moment.locale(userLanguage);
    } else {
      this.translate.use('de');
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
          this.pagesInMenu.push({ title: 'pageHeader.mintPage', pageName: '/mint', icon: 'md-analytics', url: config.mintUrl});
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
          if (page.pageName !== '/mint') {
            this.navCtrl.navigateForward(page.pageName);
          } else {
            this.handleWebIntentForWebsite(page.url);
          }
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

    this.storage.set('sessions', this.courseSessions).then(() => {
      this.home.initHome();
    });
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

  /**
   * @name openWebsite
   * @description opens a url depending on the platform
   * @param {string} url
   */
  private async handleWebIntentForWebsite(url: string) {
    if (this.platform.is('cordova')) {
      this.safariOrChrome.isAvailable().then((available: boolean) => {
        if (available) {
          this.openWithSafariOrChrome(url);
        } else { this.openWithInAppBrowser(url); }
      });
    } else { this.openWithInAppBrowser(url); }
  }

  /**
   * @name openWithInAppBrowser
   * @description opens a url with the InAppBrowser
   * @param {string} url
   */
  private openWithInAppBrowser(url: string) {
    const target = '_blank';
    this.inAppBrowser.create(url, target);
  }

  /**
   * @name openWithSafariOrChrome
   * @description opens a url with safari or chrome custom tabs
   * @param {string} url
   */
  private openWithSafariOrChrome(url: string) {
    this.safariOrChrome.show({
      url: url
    }).subscribe(
      result => { console.log('openWithSafariOrChrome', result); },
      error => { console.log('openWithSafariOrChrome', error); }
    );
  }
}
