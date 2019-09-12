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

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {

  @ViewChildren(IonRouterOutlet) routerOutlets: QueryList<IonRouterOutlet>;

  pagesInMenu: PageInterface[];
  menuSetup = false;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private cache: CacheService,
    private translate: TranslateService,
    private storage: Storage,
    private router: Router,
    private navCtrl: NavController,
    private menuCtrl: MenuController
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

      this.initializeMenu();
      this.initializeTranslate();
      this.cache.setDefaultTTL(7200);
      this.cache.setOfflineInvalidate(false);
    });
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

  initializeMenu() {
    this.pagesInMenu = [
      { title: 'pageHeader.homePage_alt', pageName: '/home', icon: 'home' },
      { title: 'pageHeader.appointmentsPage_2', pageName: '/appointments', icon: 'calendar' },
      { title: 'pageHeader.questionsPage', pageName: '/questions', icon: 'create' },
      { title: 'pageHeader.contactsPage', pageName: '/contacts', icon: 'contacts' },
      { title: 'pageHeader.feedbackPage', pageName: '/feedback', icon: 'chatboxes' },
    ];

    if (this.platform.is('ios') || this.platform.is('android')) {
      this.pagesInMenu.push({ title: 'pageHeader.pushMessagesPage', pageName: '/push-messages', icon: 'chatbubbles'});
    }

    // if (config != undefined) {
    //   if (config.mintEnabled) {
    //     this.pagesInMenu.push({ title: "pageHeader.mintPage", pageName: MintPage, icon: "md-analytics"});
    //   }
    // }

    this.pagesInMenu.push({ title: 'pageHeader.settingsPage', pageName: '/settings', icon: 'settings'});
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
