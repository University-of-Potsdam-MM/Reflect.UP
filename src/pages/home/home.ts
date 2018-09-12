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

  initHome() {
    var lastView = this.navCtrl.last().name;

    this.storage.get("session").then((session) => {
      if (!session) {
        this.navCtrl.setRoot(SelectModulePage);
      } else {
        this.connection.checkOnline().subscribe(online => {
          if (online) {
            this.storage.get("config").then((config:IModuleConfig) => {
              if (config) {

                if (lastView == "HomePage" || this.fromSideMenu || lastView == "SettingsPage") {

                  this.isLoaded = false;
                  this.isLoaded2 = false;
                  this.fromSideMenu = false;
                    
                  this.enrollSelf(config, session.token);
  
                  this.checkUpdatedCards("HomePage", config, session.token);
                  this.loadQuestions(config, session.token);
                   
                  if (this.platform.is("ios") || this.platform.is("android")) {
                    this.storage.get("pushRegistered").then(push => {
                      if (push != "yes") {
                        this.pushProv.registerPushService(config);
                      }
                    })
                  }
                } else if (lastView == "AppointmentsPage") {
                  this.checkUpdatedCards(lastView, config, session.token);
                } else if (lastView == "QuestionsPage") {
                  this.isLoaded2 = false;
                  this.loadQuestions(config, session.token);
                }

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
    var accessToken = config.authorization.credentials.accessToken;
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
      console.log("local enrol self");
    });
  }

  checkUpdatedCards(lastView, config, token) {
    this.storage.get("hiddenCards").then((hiddenArray:string[]) => {
      if (lastView != "HomePage") {
        this.storage.get("scheduledEvents").then((scheduledArray:string[]) => {
          if (hiddenArray) {
            if (!(hiddenArray.length == this.hiddenCardsLastCheck.length && hiddenArray.every((value, index) => value == this.hiddenCardsLastCheck[index]))) {
              this.loadAppointments(hiddenArray, lastView, config, token);
            } else if (scheduledArray) {
              if (!(scheduledArray.length == this.scheduledEventsLastCheck.length && scheduledArray.every((value, index) => value == this.scheduledEventsLastCheck[index]))) {
                this.loadAppointments(hiddenArray, lastView, config, token);
              }
            }
          } else if (scheduledArray) {
            if (!(scheduledArray.length == this.scheduledEventsLastCheck.length && scheduledArray.every((value, index) => value == this.scheduledEventsLastCheck[index]))) {
              this.loadAppointments(hiddenArray, lastView, config, token);
            }
          } else {
            this.loadAppointments(hiddenArray, lastView, config, token);
          }
        });
      } else {
        this.loadAppointments(hiddenArray, lastView, config, token);
      }
    });
  }

  loadAppointments(hiddenCardArray:string[], lastView, config, token) {
    this.hiddenCardsLastCheck = hiddenCardArray;
    if (lastView != "HomePage") { this.isLoaded = false; }
    this.appointm.getAppointments(config, token).subscribe((appointConf:AppointConfig) => {
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

  loadQuestions(config, token) {
    this.questions.getQuestions(config, token).subscribe((questionJson:QuestionConfig) => {
      if (questionJson.feedbacks) {
        if (questionJson.feedbacks.length > 0) { this.openQuestions = true; } else { this.openQuestions = false; }
      } else {
        this.openQuestions = false;
        console.log("error fetching feedbacks from server.");
      }    
      this.isLoaded2 = true;
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

}
