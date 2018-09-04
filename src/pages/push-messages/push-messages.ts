import { Storage } from '@ionic/storage';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { PushMessage } from '../../lib/interfaces';
import * as moment from 'moment';
import { TranslateService } from '@ngx-translate/core';

@IonicPage()
@Component({
  selector: 'page-push-messages',
  templateUrl: 'push-messages.html',
})
export class PushMessagesPage {

  noPushMessages = false;
  pushList: PushMessage[];
  timeStampArray: string[] = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, public storage: Storage, private translate: TranslateService) {
  }

  ionViewWillEnter() {

    this.storage.get("savedNotifications").then((savedArray:PushMessage[]) => {

      this.pushList = [];
      if (savedArray != undefined) {

        this.pushList = savedArray.slice().reverse();

        var i;
        this.timeStampArray = [];
        for (i = 0; i < this.pushList.length; i++) {
          moment.locale(this.translate.currentLang);
          var pushTime = moment(this.pushList[i].pushTime);
          if (this.translate.currentLang == "de") {
            this.timeStampArray.push(pushTime.format('DD. MMMM, LT'));
          } else { this.timeStampArray.push(pushTime.format('MMMM Do, LT')); }
        }

      } else { this.noPushMessages = true; };

    });

  }

}