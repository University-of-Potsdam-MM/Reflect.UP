import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import { NavController, AlertController, Platform, MenuController } from '@ionic/angular';
import { EventObject, AppointConfig } from 'src/app/lib/appointm';
import { EventService } from 'src/app/services/event/event.service';
import { ConnectionService } from 'src/app/services/connection/connection.service';
import { TranslateService } from '@ngx-translate/core';
import { QuestionService } from 'src/app/services/question/question.service';
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
export class HomePage {

  selectedModule: IModuleConfig = null;
  token = '';
  eventList: EventObject[] = [];
  isLoaded;
  isLoaded2;
  isRefreshing;
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
    private platform: Platform,
    private menu: MenuController,
    private push: Push,
    private app: AppComponent,
    private configService: ConfigService
  ) {
    this.menu.enable(true, 'sideMenu');
  }

  async ionViewWillEnter() {
    this.sessions = await this.storage.get('sessions');
    if (!this.sessions) {
      this.navCtrl.navigateRoot('/select-module');
    } else {
      this.initHome();

      if (this.platform.is('cordova')) {
        this.checkForAppUpdate();
        this.checkPushPermission();
      }
    }
  }

  checkPushPermission() {
    setTimeout(() => {
      this.push.hasPermission().then((res: any) => {
        if (res.isEnabled) {
          this.isPushAllowed = true;
        } else { this.isPushAllowed = false; }
      }, error => {
        console.log(error);
      });
    }, 500);
  }

  initHome(refresher?) {
    this.connection.checkOnline().subscribe(online => {
      if (online) {

        if (!refresher) {
          this.isLoaded = false;
          this.isLoaded2 = false;
        } else { this.isRefreshing = true; }

        this.checkUpdatedCards(refresher);
        this.loadQuestions(refresher ? true : false);
        this.app.initializeSession(true);
        this.app.initializeMenu();

      } else {
        this.showAlert('statusMessage.error.network');
      }
    });
  }

  async checkUpdatedCards(refresher?) {
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
      if (refresher) {
        this.loadAppointments(hiddenArray, scheduledArray, refresher);
      } else {
        this.loadAppointments(hiddenArray, scheduledArray);
      }
    } else {
      if (refresher) { refresher.target.complete(); this.isRefreshing = false; }
      this.isLoaded = true;
    }
  }

  loadAppointments(hiddenCardArray: string[], scheduledEventsArray: string[], refresher?) {
    if (hiddenCardArray !== undefined) { this.hiddenCardsLastCheck = hiddenCardArray; }
    if (scheduledEventsArray !== undefined) { this.scheduledEventsLastCheck = scheduledEventsArray; }

    const tmpEventArray = [];
    const loop = dLoop(this.sessions, (itm, idx, fin) => {
      if (!itm.isHidden) {
        const config: IModuleConfig = this.configService.getConfigById(itm.courseID);
        this.appointm.getAppointments(config, itm.token, refresher ? true : false).subscribe((appointConf: AppointConfig) => {
          if (appointConf.events) {
            for (const event of appointConf.events) {
              if (event.modulename !== 'feedback') {
                event.hexColor = itm.hexColor;

                let eventDuplicate = false;
                for (let i = 0; i < tmpEventArray.length; i++) {
                  if (
                    tmpEventArray[i].name === event.name
                    && tmpEventArray[i].timestart === event.timestart
                    && tmpEventArray[i].timeduration === event.timeduration
                  ) {
                    eventDuplicate = true;
                    tmpEventArray[i].hexColor = undefined;
                  }
                }

                if (!eventDuplicate) {
                  tmpEventArray.push(event);
                }

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
      } else { fin(); }
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
      if (refresher) { refresher.target.complete(); this.isRefreshing = false; }
    });
  }

  async visibilityChanged(eventID) {
    this.isRefreshing = true;
    const hiddenCardArray = await this.storage.get('hiddenCards');
    this.hiddenEvent[eventID] = true;

    let i = 0;
    for (const event of this.eventList) {

      if (hiddenCardArray) {
        const foundID = hiddenCardArray.find(element => element === event.id.toString());
        if (foundID !== undefined) {
          this.hiddenEvent[event.id] = true;
        } else { this.hiddenEvent[event.id] = false; }
      }

      if (!this.hiddenEvent[event.id]) {
        if (i > 2) {
          this.hiddenEvent[event.id] = true;
        } else { i += 1; }
      }
    }

    this.isRefreshing = false;
  }

  loadQuestions(forceReload) {
    const loop = dLoop(this.sessions, (itm, idx, fin) => {
      if (!itm.isHidden) {
        if (!this.openQuestions) {
          const config: IModuleConfig = this.configService.getConfigById(itm.courseID);
          this.questions.getQuestions(config, itm.token, forceReload).subscribe((questionJSON: QuestionConfig) => {
            if (questionJSON && questionJSON.feedbacks) {
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
      } else { fin(); }
    });

    loop.then(() => {
      this.isLoaded2 = true;
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
    this.navCtrl.navigateForward('/questions');
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
              this.storage.remove('appUpdateAvailable');
            }
          }
        ],
        backdropDismiss: false
      });
      await alert.present();
    }
  }
}
