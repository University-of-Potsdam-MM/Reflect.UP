import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { NavController, AlertController, Platform, MenuController } from '@ionic/angular';
import { EventObject, AppointConfig } from 'src/app/lib/appointm';
import { EventService } from 'src/app/services/event/event.service';
import { ConnectionService } from 'src/app/services/connection/connection.service';
import { TranslateService } from '@ngx-translate/core';
import { QuestionService } from 'src/app/services/question/question.service';
import { PushService } from 'src/app/services/push/push.service';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Push } from '@ionic-native/push/ngx';
import { IModuleConfig } from 'src/app/lib/config';
import { QuestionConfig } from 'src/app/lib/question';
import { AppComponent } from 'src/app/app.component';
import { ISession } from 'src/app/services/login-provider/interfaces';
import { ConfigService } from 'src/app/services/config/config.service';
import * as dLoop from 'delayed-loop';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  selectedModule: IModuleConfig = null;
  token = '';
  eventList: EventObject[] = [];
  isLoaded;
  isLoaded2;
  openQuestions = false;
  hiddenCardsLastCheck: string[] = [];
  scheduledEventsLastCheck: string[] = [];
  fromSideMenu = false;
  hiddenEvent: boolean[] = [];
  scheduledEvent: boolean[] = [];
  isPushAllowed = true;

  sessions: ISession[];

  constructor(
    private storage: Storage,
    private navCtrl: NavController,
    private appointm: EventService,
    private connection: ConnectionService,
    private alertCtrl: AlertController,
    private translate: TranslateService,
    private questions: QuestionService,
    private pushProv: PushService,
    private platform: Platform,
    private menu: MenuController,
    private http: HttpClient,
    private push: Push,
    private app: AppComponent,
    private configService: ConfigService
  ) {
    this.menu.enable(true, 'sideMenu');
  }

  ngOnInit() { }

  async ionViewWillEnter() {
    this.sessions = await this.storage.get('sessions');
    if (!this.sessions) {
      this.navCtrl.navigateRoot('/select-module');
    } else { console.log(this.sessions); }

    this.initHome();
    if (this.platform.is('cordova')) {
      this.checkForAppUpdate();
      this.checkPushPermission();
    }
  }

  checkPushPermission() {
    setTimeout(() => {
      this.push.hasPermission().then((res: any) => {
        if (res.isEnabled) {
          this.isPushAllowed = true;
        } else { this.isPushAllowed = false; }
      });
    }, 5000);
  }

  initHome(refresher?, ionRefresh?) {
    this.connection.checkOnline().subscribe(online => {
      if (online || !ionRefresh) {

        if (ionRefresh) { this.isLoaded = false; }

        const loop = dLoop(this.sessions, (itm, idx, fin) => {
          const config: IModuleConfig = this.configService.getConfigById(itm.courseID);

          if (online) {
            this.enrollSelf(config, itm.token);

            if (this.platform.is('cordova')) {
              this.pushProv.registerPushService(config);
            }
          }

          fin();
        });

        loop.then(() => {
          this.checkUpdatedCards();
          this.loadQuestions(refresher);
          this.app.initializeMenu();
        });

      } else {
        this.showAlert('statusMessage.error.network');
      }
    });
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

  async checkUpdatedCards() {
    const hiddenArray = await this.storage.get('hiddenCards');
    const scheduledArray = await this.storage.get('scheduledEvents');

    let newHiddenEvents = true;
    let newScheduledEvents = true;

    if (hiddenArray !== null) {
      newHiddenEvents = (hiddenArray.length !== this.hiddenCardsLastCheck.length)
      || !(hiddenArray.every((value, index) => value === this.hiddenCardsLastCheck[index]));
    }

    if (scheduledArray !== null) {
      newScheduledEvents = (scheduledArray.length !== this.scheduledEventsLastCheck.length)
      || !(scheduledArray.every((value, index) => value === this.scheduledEventsLastCheck[index]));
    }

    if (newHiddenEvents || newScheduledEvents) {
      this.loadAppointments(hiddenArray, scheduledArray, true);
    } else { this.isLoaded = true; }
  }

  loadAppointments(hiddenCardArray: string[], scheduledEventsArray: string[], forceReload) {
    if (hiddenCardArray !== undefined) { this.hiddenCardsLastCheck = hiddenCardArray; }
    if (scheduledEventsArray !== undefined) { this.scheduledEventsLastCheck = scheduledEventsArray; }

    const tmpEventArray = [];
    const loop = dLoop(this.sessions, (itm, idx, fin) => {
      const config: IModuleConfig = this.configService.getConfigById(itm.courseID);
      this.appointm.getAppointments(config, itm.token, forceReload).subscribe((appointConf: AppointConfig) => {
        if (appointConf.events) {
          for (const event of appointConf.events) {
            if (event.modulename !== 'feedback') {
              tmpEventArray.push(event);

              if (hiddenCardArray) {
                const foundID = hiddenCardArray.find(element => element === event.id.toString());
                if (foundID !== undefined) {
                  this.hiddenEvent[event.id] = true;
                } else { this.hiddenEvent[event.id] = false; }
              }

              if (scheduledEventsArray) {
                const notificationID = event.id * 10;
                const foundID_2 = scheduledEventsArray.find(element => element === notificationID.toString());
                if (foundID_2 !== undefined) {
                  this.scheduledEvent[event.id] = true;
                } else { this.scheduledEvent[event.id] = false; }
              } else { this.scheduledEvent[event.id] = false; }
            }
          }
        }

        fin();
      }, error => {
        console.log(error);
        fin();
      });
    });

    loop.then(() => {
      this.eventList = tmpEventArray.sort((a: EventObject, b: EventObject) => a.timestart - b.timestart);

      let i = 0;
      for (const event of this.eventList) {
        if (!this.hiddenEvent[event.id]) {
          if (i > 2) {
            this.hiddenEvent[event.id] = true;
          } else { i += 1; }
        }
      }

      this.isLoaded = true;
    });
  }

  loadQuestions(refresher?) {
    const forceReload = refresher ? true : false;
    const loop = dLoop(this.sessions, (itm, idx, fin) => {
      if (!this.openQuestions) {
        const config: IModuleConfig = this.configService.getConfigById(itm.courseID);
        this.questions.getQuestions(config, itm.token, forceReload).subscribe((questionJSON: QuestionConfig) => {
          if (questionJSON.feedbacks) {
            if (questionJSON.feedbacks.length > 0) {
              this.openQuestions = true;
            } else { this.openQuestions = false; }
          } else { this.openQuestions = false; }

          fin();
        }, error => {
          console.log(error);
          fin();
        });
      } else { fin(); }
    });

    loop.then(() => {
      this.isLoaded2 = true;
      if (refresher) { refresher.target.complete(); }
    });
  }

  async notificationStatusChanged() {
    this.scheduledEventsLastCheck = await this.storage.get('scheduledEvents');
  }

  async showAlert(alertTextKey: string) {
    const alert = await this.alertCtrl.create({
      header: this.translate.instant('statusMessage.error.title'),
      subHeader: this.translate.instant(alertTextKey),
      buttons: [
        this.translate.instant('buttonLabel.ok')
      ]
    });
    await alert.present();
  }

  goToQuestions() {
    this.navCtrl.navigateRoot('questions');
  }

  async checkForAppUpdate() {
    const updateAvailable = await this.storage.get('appUpdateAvailable');
    if (updateAvailable) {
      let message;
      if (this.platform.is('ios')) {
        message = this.translate.instant('statusMessage.update.messageIOS');
      } else { message = this.translate.instant('statusMessage.update.messageANDROID'); }

      const alert = await this.alertCtrl.create({
        header: this.translate.instant('statusMessage.update.title'),
        message: message,
        buttons: [
          {
            text: this.translate.instant('buttonLabel.ok'),
            handler: () => {
              this.storage.set('appUpdateAvailable', false);
            }
          }
        ],
        backdropDismiss: false
      });
      await alert.present();
    }
  }
}
