import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { SelectModulePage } from './../select-module/select-module';
import { QuestionsPage } from './../questions/questions';
import { QuestionProvider } from '../../providers/question-provider/question-provider';
import { ConnectionProvider } from '../../providers/connection-provider/connection-provider';
import { Component } from '@angular/core';
import { NavController, AlertController, Platform, MenuController, NavParams } from 'ionic-angular';
import { IModuleConfig } from '../../lib/interfaces/config';
import { Storage } from '@ionic/storage';
import { EventProvider } from '../../providers/event-provider/event-provider';
import { AppointConfig, EventObject } from '../../lib/interfaces/appointm';
import { TranslateService } from '@ngx-translate/core';
import { QuestionConfig } from '../../lib/interfaces/question';
import { PushProvider } from '../../providers/push-provider/push-provider';
import { Push } from '@ionic-native/push';
import { MyApp } from '../../app/app.component';

/**
 * HomePage
 */
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  selectedModule:IModuleConfig = null;
  token:string = "";
  eventList: EventObject[] = [];
  isLoaded;
  isLoaded2;
  openQuestions = false;
  hiddenCardsLastCheck: string[] = ["0"];
  scheduledEventsLastCheck: string[] = ["0"];
  fromSideMenu = false;
  hiddenEvent: boolean[] = [];
  scheduledEvent: boolean[] = [];
  isPushAllowed = true;

  constructor(
      private navCtrl: NavController,
      private storage: Storage,
      private appointm: EventProvider,
      private connection: ConnectionProvider,
      private alertCtrl: AlertController,
      private app: MyApp,
      private translate: TranslateService,
      private questions: QuestionProvider,
      private pushProv: PushProvider,
      private platform: Platform,
      private menu: MenuController,
      private http: HttpClient,
      private navParams: NavParams,
      private push: Push
    ) {
    this.menu.enable(true,"sideMenu");
  }

  ngOnInit() {
    this.fromSideMenu = this.navParams.get("fromSideMenu");
  }

  ionViewWillEnter() {
    this.initHome();
    if (this.platform.is("cordova")) { this.checkForAppUpdate(); }
  }

  ionViewDidLoad() {
    if (this.platform.is("cordova")) {
      let timeout = setTimeout(() => {
        this.push.hasPermission().then((res: any) => {
          if (res.isEnabled) {
            this.isPushAllowed = true;
          } else { this.isPushAllowed = false; }
        });
      }, 5000);
      console.log(timeout);
    }
  }

  initHome(refresher?, ionRefresh?) {

    this.storage.get("session").then((session) => {
      if (!session) {
        this.navCtrl.setRoot(SelectModulePage);
      } else {
        this.connection.checkOnline().subscribe(online => {
          if (online || !ionRefresh) {
            this.storage.get("config").then((config:IModuleConfig) => {
              if (config) {
                if (online) {
                  this.enrollSelf(config, session.token);

                  if (this.platform.is("cordova")) {
                    this.storage.get("pushRegistered").then(push => {
                      if (!push) {
                        this.pushProv.registerPushService(config);
                      }
                    });
                  }
                } else { this.showAlert("statusMessage.error.network"); }

                if (this.fromSideMenu || ionRefresh) {

                  var forceReload;
                  if (!ionRefresh) {
                    this.isLoaded = false;
                    this.isLoaded2 = false;
                    forceReload = false;
                  } else { forceReload = true; }

                  this.fromSideMenu = false;

                  this.checkUpdatedCards(false, config, session.token, forceReload);
                  this.loadQuestions(config, session.token, refresher);

                } else {
                  this.checkUpdatedCards(true, config, session.token, false);
                  this.loadQuestions(config, session.token);
                }

                this.app.initMenu();

              }
            });

          } else {
            this.showAlert("statusMessage.error.network");
          }
        });
      }
    });
  }

  enrollSelf(config:IModuleConfig, token) {
    var moodleAccessPoint = config.moodleServiceEndpoint;
    var accessToken = config.authorization.credentials.authHeader.accessToken;
    var courseID = config.courseID;
    var wstoken = token;

    let params: HttpParams = new HttpParams()
      .append("wstoken", wstoken)
      .append("wsfunction", "local_reflect_enrol_self")
      .append("moodlewsrestformat", "json")
      .append("courseID", courseID);

    let headers: HttpHeaders = new HttpHeaders()
      .append("Authorization", accessToken);

    this.http.get(moodleAccessPoint, {headers:headers, params:params}).subscribe(data => {
      console.log(data);
      console.log("local enrol self");
    });
  }

  checkUpdatedCards(notHome, config:IModuleConfig, token, forceReload) {
    this.storage.get("hiddenCards").then((hiddenArray:string[]) => {
      if (notHome) {
        this.storage.get("scheduledEvents").then((scheduledArray:string[]) => {
          if (hiddenArray) {
            if (!((hiddenArray.length == this.hiddenCardsLastCheck.length) && (hiddenArray.every((value, index) => value == this.hiddenCardsLastCheck[index])))) {
              this.loadAppointments(hiddenArray, config, token, forceReload);
            } else if (scheduledArray) {
              if (!((scheduledArray.length == this.scheduledEventsLastCheck.length) && (scheduledArray.every((value, index) => value == this.scheduledEventsLastCheck[index])))) {
                this.loadAppointments(hiddenArray, config, token, forceReload);
              }
            }
          } else if (scheduledArray) {
            if (!((scheduledArray.length == this.scheduledEventsLastCheck.length) && (scheduledArray.every((value, index) => value == this.scheduledEventsLastCheck[index])))) {
              this.loadAppointments(hiddenArray, config, token, forceReload);
            }
          } else {
            this.loadAppointments(hiddenArray, config, token, forceReload);
          }
        });
      } else {
        this.loadAppointments(hiddenArray, config, token, forceReload);
      }
    });
  }

  loadAppointments(hiddenCardArray:string[], config:IModuleConfig, token, forceReload) {
    this.hiddenCardsLastCheck = hiddenCardArray;
    this.appointm.getAppointments(config, token, forceReload).subscribe((appointConf:AppointConfig) => {
      if (appointConf.events) {
        this.eventList = [];
        var j = 0;
        if (hiddenCardArray) {
          for (let event of appointConf.events) {
            if (event.modulename != "feedback") {
              var foundID = hiddenCardArray.find(element => element == event.id.toString());
              if (foundID != undefined) {
                this.hiddenEvent[event.id] = true;
              } else if (j > 2) {
                this.hiddenEvent[event.id] = true;
              } else {
                this.hiddenEvent[event.id] = false;
                j = j + 1;
              }
              this.eventList.push(event);
            }
          }
        } else {
          for (let event of appointConf.events) {
            if (event.modulename != "feedback") {
              if (j > 2) {
                this.hiddenEvent[event.id] = true;
              } else {
                this.hiddenEvent[event.id] = false;
                j = j + 1;
              }
              this.eventList.push(event);
            }
          }
        }

        this.storage.get("scheduledEvents").then((array:string[]) => {
          this.scheduledEventsLastCheck = array;
          var notificationID;
          if (array) {
            for (let event of appointConf.events) {
              if (event.modulename != "feedback") {
                notificationID = event.id * 10;
                var foundID = array.find(element => element == notificationID.toString());
                if (foundID != undefined) {
                  this.scheduledEvent[event.id] = true;
                } else { this.scheduledEvent[event.id] = false; }
              }
            }
          } else {
            for (let event of appointConf.events) {
              if (event.modulename != "feedback") {
                this.scheduledEvent[event.id] = false;
              }
            }
          }
          this.isLoaded = true;
        });
      } else {
        this.isLoaded = true;
      }
    });
  }

  loadQuestions(config:IModuleConfig, token, refresher?) {
    var forceReload;
    if (refresher) { forceReload = true; } else { forceReload = false; }
    this.questions.getQuestions(config, token, forceReload).subscribe((questionJson:QuestionConfig) => {
      if (questionJson.feedbacks) {
        if (questionJson.feedbacks.length > 0) { this.openQuestions = true; } else { this.openQuestions = false; }
      } else {
        this.openQuestions = false;
        console.log("error fetching feedbacks from server.");
      }
      this.isLoaded2 = true;
      if (refresher) {
        this.doRefresh(refresher, true);
      }
    });
  }

  notificationStatusChanged() {
    this.storage.get("scheduledEvents").then((array:string[]) => {
      this.scheduledEventsLastCheck = array;
    });
  }

  showAlert(alertTextKey:string) {
    let alert = this.alertCtrl.create({
      title: this.translate.instant("statusMessage.error.title"),
      subTitle: this.translate.instant(alertTextKey),
      buttons: [
        this.translate.instant("buttonLabel.ok")
      ]
    });
    alert.present();
  }

  goToQuestions() {
    this.navCtrl.push(QuestionsPage);
  }

  doRefresh(refresher, refreshingComplete?) {
    if (refreshingComplete) {
      refresher.complete();
    } else {
      this.initHome(refresher, true);
    }
  }

  checkForAppUpdate() {
    this.storage.get("config").then((config:IModuleConfig) => {
      if (config) {
        this.storage.get("appUpdateAvailable").then(updateAvailable => {
          if (updateAvailable === true) {
            if (this.platform.is("ios")) {
              let alert = this.alertCtrl.create({
                title: this.translate.instant("statusMessage.update.title"),
                message: this.translate.instant("statusMessage.update.messageIOS"),
                buttons: [
                  {
                    text: this.translate.instant("buttonLabel.ok"),
                    handler: () => {
                      this.storage.set("appUpdateAvailable", config.appVersion);
                    }
                  }
                ],
                enableBackdropDismiss: false,
              });
              alert.present();
            } else {
              let alert = this.alertCtrl.create({
                title: this.translate.instant("statusMessage.update.title"),
                message: this.translate.instant("statusMessage.update.messageANDROID"),
                buttons: [
                  {
                    text: this.translate.instant("buttonLabel.ok"),
                    handler: () => {
                      this.storage.set("appUpdateAvailable", config.appVersion);
                    }
                  }
                ],
                enableBackdropDismiss: false,
              });
              alert.present();
            }
          }
        });
      }
    });
  }

}
