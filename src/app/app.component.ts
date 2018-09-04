import { Keyboard } from '@ionic-native/keyboard';
import { PushProvider } from '../providers/push-provider/push-provider';
import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { TranslateService } from '@ngx-translate/core';
import { HttpClient } from '../../node_modules/@angular/common/http';
import { ConnectionProvider } from '../providers/connection-provider/connection-provider';
import { PageInterface } from '../lib/interfaces';
import { IModuleConfig } from '../lib/interfaces/config';
import { Storage } from '@ionic/storage';

/* ~~~ Pages ~~~ */
import { HomePage } from '../pages/home/home';
import { ContactsPage } from '../pages/contacts/contacts';
import { AppointmentsPage } from '../pages/appointments/appointments';
import { FeedbackPage } from '../pages/feedback/feedback';
import { QuestionsPage } from '../pages/questions/questions';
import { SettingsPage } from '../pages/settings/settings';
import { LogoutPage } from '../pages/logout/logout';
import { SelectModulePage } from '../pages/select-module/select-module';
import { PushMessagesPage } from './../pages/push-messages/push-messages';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any;
  pagesInMenu: PageInterface[];

  constructor(
      private platform: Platform,
      private statusBar: StatusBar,
      private splashScreen: SplashScreen,
      private translate: TranslateService,
      private http: HttpClient,
      private connection: ConnectionProvider,
      private storage: Storage,
      private pushProv: PushProvider,
      private keyboard: Keyboard) {
    this.initApp();
  }

  /**
   * initApp
   *
   * initializes the app
   */
  private async initApp() {
    await this.initConfig();
    await this.initTranslate();
    await this.initMenu();

    this.platform.ready().then(() => {
      if (this.platform.is("cordova")) {
        this.splashScreen.hide();
        this.statusBar.styleDefault();
        this.keyboard.disableScroll(true);
        this.storage.set("hiddenCards", []);
        this.storage.set("scheduledEvents", []);
      }
    });
  }

  /**
   * initConfig
   * 
   * fetches config from server if there's an internet connection
   * sets root page accordingly
   */
  private initConfig() {
    var config_url = "https://apiup.uni-potsdam.de/endpoints/staticContent/2.0/config.json";

    this.storage.get("config").then((localConfig) => {
      if (localConfig) {
        this.connection.checkOnline().subscribe((online) => {
          if (online) {
            this.http.get<IModuleConfig[]>(config_url).subscribe((configList) => {
              for (let config of configList) {
                if (localConfig.id == config.id) {
                  // store up-to-date config in storage
                  this.storage.set("config", config);
                  this.initPush(config);
                  break;
                }
              }
            });
          } else {
            this.initPush(localConfig);
          }
          this.rootPage = HomePage;
        });
      } else {
        this.rootPage = SelectModulePage;
      }
    });
  }

  /**
   * initPush
   * 
   * registers push service to ensure push notifications work
   * even after app has been closed
   * @param config 
   */
  private initPush(config) {
    if (this.platform.is("ios") || this.platform.is("android")) {
      this.pushProv.registerPushService(config);
    }
  }

  /**
   * initMenu
   *
   * sets up menu entries and icons
   */
  private initMenu() {
    // only show push-notifications page when on mobile device
    if (this.platform.is("ios") || this.platform.is("android")) {
      this.pagesInMenu = [
        { title: "pageHeader.homePage_alt", pageName: HomePage, icon: "home" },
        { title: "pageHeader.appointmentsPage_2", pageName: AppointmentsPage, icon: "alarm" },
        { title: "pageHeader.questionsPage", pageName: QuestionsPage, icon: "create" },
        { title: "pageHeader.contactsPage", pageName: ContactsPage, icon: "contacts" },
        { title: "pageHeader.feedbackPage", pageName: FeedbackPage, icon: "chatboxes" },
        { title: "pageHeader.pushMessagesPage", pageName: PushMessagesPage, icon: "chatbubbles"},
        { title: "pageHeader.settingsPage", pageName: SettingsPage, icon: "settings"},
        { title: "pageHeader.logoutPage", pageName: LogoutPage, icon: "log-out" }
      ];
    } else {
      this.pagesInMenu = [
        { title: "pageHeader.homePage_alt", pageName: HomePage, icon: "home" },
        { title: "pageHeader.appointmentsPage_2", pageName: AppointmentsPage, icon: "alarm" },
        { title: "pageHeader.questionsPage", pageName: QuestionsPage, icon: "create" },
        { title: "pageHeader.contactsPage", pageName: ContactsPage, icon: "contacts" },
        { title: "pageHeader.feedbackPage", pageName: FeedbackPage, icon: "chatboxes" },
        { title: "pageHeader.settingsPage", pageName: SettingsPage, icon: "settings"},
        { title: "pageHeader.logoutPage", pageName: LogoutPage, icon: "log-out" }
      ];
    }
  }

  /**
   * initTranslate
   *
   * sets up translation
   */
  private initTranslate() {
    // set the default language for translation strings, and the current language.
    this.translate.setDefaultLang('de');

    // check if language preference has been saved to storage
    this.storage.get("appLanguage").then((value) => {
      if (value != null) {
        this.translate.use(value);
      } else {
        this.translate.use("de");
        this.storage.set("appLanguage","de");
      }
    });
  }

  /**
   * openPage
   *
   * opens the selected page
   * @param page
   */
  openPage(page:PageInterface) {
    // pushes selected page (except if its the HomePage, then it sets a new root)
    if ((page.pageName == HomePage) && (this.nav.getActive().component != HomePage)) {
      this.nav.setRoot(page.pageName, {fromSideMenu: true});
    } else {
      if (this.nav.getActive().component != page.pageName) {
        this.nav.popToRoot();
        this.nav.push(page.pageName);
      }
    }

  }
}
