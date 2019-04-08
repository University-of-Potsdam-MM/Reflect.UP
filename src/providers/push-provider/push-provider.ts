import { IModuleConfig } from '../../lib/interfaces/config';
import { Storage } from '@ionic/storage';
import { TranslateService } from '@ngx-translate/core';
import { Push, PushObject, PushOptions } from '@ionic-native/push';
import { Platform, App, AlertController } from 'ionic-angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PushMessagesPage } from '../../pages/push-messages/push-messages';
import * as moment from 'moment';
import { PushMessage } from '../../lib/interfaces';

@Injectable()
export class PushProvider {

  newCount = 0;

  public global_registrationID = "";

  constructor(public http: HttpClient,
              public platform: Platform,
              public push: Push,
              private alertCtrl: AlertController,
              private translate: TranslateService,
              private storage:Storage,
              private app: App) {

  }

  ngOnInit() {
    this.storage.get("notificationCount").then(data => {
      if (data != undefined) {
        this.newCount = Number(data);
      }
    })
  }

  createPushOptions(deviceID) {
    var tokenPayload = {
      device: null,
      token: null,
      channel: "default"
    };


    if (this.platform.is('ios')) {
      tokenPayload.device = "ios";
      tokenPayload.token = deviceID;
    } else {
      tokenPayload.device = "android";
      tokenPayload.token = deviceID;
    }

    return tokenPayload;
  }

  subscribeToPush(registrationID, config:IModuleConfig) {

    // subscribe to the AirNotifier push service
    let url_subscribe = config.pushDetails.uniqushUrl.concat("tokens/");
    // console.log("registering push via " + url_subscribe);

    let myData = JSON.stringify(this.createPushOptions(registrationID));
    // console.log("with payload " + myData);

    var headerAppName = "reflectup";
    headerAppName = headerAppName.concat(config.courseID.replace(/-/g,'').toLowerCase());
    var headerAppKey = config.pushDetails.XAnAppKey;

    const myHeaders = {
      headers: new HttpHeaders({
        "Authorization": "Bearer 732c17bd-1e57-3e90-bfa7-118ce58879e8",
        "Accept": "application/json",
        "X-An-App-Name": headerAppName,
        "X-An-App-Key": headerAppKey
      })
    };

    // doesn't work with livereload
    this.http.post(url_subscribe, myData, myHeaders).subscribe(res => {
      console.log("(subscribe): successfully contacted the push server.");
      console.log(res);
      this.storage.set("pushRegistered", "yes");
    }, err => {
      console.log("(subscribe): error while contacting the push server.");
      console.log(err);
      console.log(err.message);

      if (err.status == 200) {
        console.log("(subscribe): successfully contacted the push server.");
        this.storage.set("pushRegistered", "yes");
      }
    });

  }

  unsubscribeToPush(config:IModuleConfig) {
    // unsubscribe from the AirNotifier push service
    var url_unsubscribe = config.pushDetails.uniqushUrl.concat("tokens/") + this.global_registrationID;

    var headerAppName = "reflectup";
    headerAppName = headerAppName.concat(config.courseID.replace(/-/g,'').toLowerCase());
    var headerAppKey = config.pushDetails.XAnAppKey;

    let headers:HttpHeaders = new HttpHeaders()
      .append("Accept", "application/json")
      .append("X-An-App-Name", headerAppName)
      .append("X-An-App-Key", headerAppKey)
      .append("Authorization", "Bearer 732c17bd-1e57-3e90-bfa7-118ce58879e8");

    this.http.delete(url_unsubscribe, {headers:headers}).subscribe(res => {
      // console.log("(unsubscribe): successfully contacted the push server.");
    }, (err) => {
      console.log("(unsubscribe): error while contacting the push server." + err.message);
    });
  }

  registerPushService(config:IModuleConfig) {
    // registration to the push service
    this.push.hasPermission().then(res => {
      if (res.isEnabled) {
        // console.log('We have permission to send push notifications');
      } else {
        console.log('We do NOT have permission to send push notifications');
        return;
      }
    });

    // notification channel for Android O and above
    this.push.createChannel({
      id: "Reflect.UP",
      description: "Channel for Reflect.UP",
      importance: 3,
      visibility: 1
    }).then(() => console.log("Channel created.")).catch(() => {
      console.log("Error creating the Channel.");
    });

    const options: PushOptions = {
      android: {
        senderID: config.pushDetails.senderID
      },
      browser: {
        pushServiceURL: config.pushDetails.uniqushUrl
      },
      ios: {
        alert: true,
        badge: true,
        sound: true,
        clearBadge: true
      },
      windows: {}
    };


    const pushObject:PushObject = this.push.init(options);

    pushObject.on("notification").subscribe(data => {

      var title;
      // set default title if there is no title in push notification
      if (data.title) { title = data.title; } else { title = "Reflect.UP"; };

      this.storage.get("notificationCount").then(oldCount => {

        // set notification counter
        if (oldCount) { this.newCount = Number(oldCount) + 1; } else { this.newCount = 1; }
        this.storage.set("notificationCount", this.newCount);
        // console.log("notificationCount: " + this.newCount);

        var currentTime = moment();

        let pushDetails = {
          pushMessage: data.message,
          pushTitle: title,
          pushCount: this.newCount,
          pushTime: currentTime
        }

        this.storage.get("savedNotifications").then((oldArray:PushMessage[]) => {

          var notArray: PushMessage[];
          var lastIndex;
          if (oldArray) {
            lastIndex = oldArray.length;
            notArray = new Array(oldArray.length + 1);
            notArray = oldArray.slice(0,lastIndex);
          } else {
            lastIndex = 0;
            notArray = new Array(1);
          }

          notArray[lastIndex] = pushDetails;
          // save notification to local storage
          this.storage.set("savedNotifications", notArray);
        });

      });

      // only schedule an alert when notification is received while app in foreground
      if (data.additionalData.foreground) {
        let alert = this.alertCtrl.create({
          title: title,
          message: data.message,
          buttons: [
            {
              text: this.translate.instant("buttonLabel.ok"),
              role: 'dismiss',
              handler: () => {
                // console.log("Dialog dismissed");
              }
            },
            {
              text: this.translate.instant("buttonLabel.show"),
              role: 'show',
              handler: () => {
                var nav = this.app.getRootNav();
                nav.push(PushMessagesPage);
              }
            }
          ],
          enableBackdropDismiss: false,
        });
        alert.present();
      } else {
        // redirect user to messages page
        var nav = this.app.getRootNav();
        nav.push(PushMessagesPage);
      }

      // calling pushObject.finish (necessary on iOS)
      pushObject.finish().then(() => {
        // console.log("Processing finished.")
      }).catch(() => {
        console.log("Error while processing background push.");
      });
    });

    pushObject.on("registration").subscribe(data => {
      if (data.registrationId.length == 0) {
        console.log("ERROR: Push registrationID is empty");
      } else {
        this.global_registrationID = data.registrationId;
        this.subscribeToPush(data.registrationId, config);
      }
    });

    pushObject.on("error").subscribe(data => {
      console.log("Push error happened: " + data.message);
    });

  }

}
