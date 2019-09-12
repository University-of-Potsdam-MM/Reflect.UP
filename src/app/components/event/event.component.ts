import { Component, OnInit, Input, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { EventObject } from 'src/app/lib/appointm';
import { TranslateService } from '@ngx-translate/core';
import { AlertController, Platform } from '@ionic/angular';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import * as moment from 'moment';
import * as $ from 'jquery';
import * as _ from 'underscore';
import { Router } from '@angular/router';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.scss'],
})
export class EventComponent implements OnInit, AfterViewInit {

  // boolean flags
  hasAlreadyBegun;
  isCordovaApp;
  isFullDayEvent;
  isHomePage;
  isNotificationScheduled;
  isVisible;
  showLongDescription;

  // formatted momentJS dates
  eventStart;
  eventEnd;
  eventFullDay;

  // Inputs passed from Page to Component
  @Input() private event: EventObject;
  @Input() private index: number;
  @Input() private hiddenEvent: boolean;
  @Input() private scheduledEvent: boolean;
  @Input() private isPushAllowed: boolean;

  // Output-Events that can be listened to by the Page
  @Output() visibilityChanged = new EventEmitter();
  @Output() notificationStatusChanged = new EventEmitter();

  constructor(
    private translate: TranslateService,
    private storage: Storage,
    private localNotifications: LocalNotifications,
    private router: Router,
    private alertCtrl: AlertController,
    private platform: Platform
  ) { }

  ngOnInit() {
    if (this.router.url === '/home') {
      this.isHomePage = true;
      this.showLongDescription = false;
    } else {
      this.isHomePage = false;
      this.showLongDescription = true;
    }

    if (this.platform.is('ios') || this.platform.is('android')) {
      this.isCordovaApp = true;
    } else { this.isCordovaApp = false; }

    if (this.scheduledEvent) {
      this.isNotificationScheduled = true;
    } else { this.isNotificationScheduled = false; }

    if (this.hiddenEvent) {
      this.isVisible = false;
    } else { this.isVisible = true; }

    this.initEvent();
  }

  ngAfterViewInit() {
    if (this.isHomePage) {
      this.getDescriptionHeight();
    }
  }

  /**
   * initEvent
   *
   * handles and formats eventStart, eventBegin, eventFullDay, hasAlreadyBegun
   */
  initEvent() {
    const language = this.translate.currentLang;
    moment.locale(language);
    if (this.translate.currentLang === 'de') {
      this.eventStart = moment(this.event.timestart * 1000).format('DD. MMM, LT');
      this.eventEnd = moment((this.event.timestart + this.event.timeduration) * 1000).format('DD. MMM, LT');
    } else {
      this.eventStart = moment(this.event.timestart * 1000).format('MMM Do, LT');
      this.eventEnd = moment((this.event.timestart + this.event.timeduration) * 1000).format('MMM Do, LT');
    }

    if (this.eventStart === this.eventEnd) {
      this.isFullDayEvent = true;
      this.eventFullDay = moment(this.event.timestart * 1000).format('L');
    } else { this.isFullDayEvent = false; }

    const currentTime = moment();
    if (currentTime.isAfter(moment(this.event.timestart * 1000))) {
      this.hasAlreadyBegun = true;
    } else { this.hasAlreadyBegun = false; }

  }

  /**
   * processes multi language tags from moodle and returns
   * string that matches app language
   *
   * @param stringToAnalize - string that could containt multi-language tags
   */
  processMoodleContents(stringToAnalize: string) {
    try {
      const domObj = $($.parseHTML(stringToAnalize));
      let result = stringToAnalize;
      const language = this.translate.currentLang;

      if (domObj.length > 1) {

          _.each(domObj, function(element) {
            if ($(element)[0].lang === language) {
              result = $(element).html();
            }
          });

          // use englisch as a fallback
          if (result === stringToAnalize) {
            _.each(domObj, function(element) {
              if ($(element)[0].lang === 'en') {
                result = $(element).html();
              }
            });
          }
      }
      return result;
    } catch (e) {
      console.log(e);
      return stringToAnalize;
    }
  }

  /**
   * changes card visibility and adds / removes
   * card from hiddenCards-array that gets saved to the storage
   */
  toggleCardVisibility() {
    this.isVisible = !this.isVisible;
    this.storage.get('hiddenCards').then((array: string[]) => {
      let tmpArray;

      // if card is now hidden, push it's eventID to new hiddenCards-array
      if (!this.isVisible) {
        if (array && (array.length > 0)) {
          tmpArray = array;
          tmpArray.push(this.event.id.toString());
        } else {
          tmpArray = [];
          tmpArray.push(this.event.id.toString());
        }
      } else {
        // if card was hidden before, don't push eventID to new hiddenCards-array
        tmpArray = [];
        let i;
        if (array) {
          for (i = 0; i < array.length; i++) {
            if (array[i] !== this.event.id.toString()) {
              tmpArray.push(array[i]);
            }
          }
        }
      }
      // save new hiddenCards-array to storage
      this.storage.set('hiddenCards', tmpArray).then(data => {
        if (this.isHomePage) {
          this.visibilityChanged.emit();
        }
      });
    });
  }

  getCardClass() {
    if (this.isVisible) {
      return 'visibleCard';
    } else { return 'hiddenCard'; }
  }

  /**
   * on HomePage: only max 3 lines of description should be visible
   * gets divDescriptions client-height and hides "showMore"-button
   * if description is shorter than 3 lines
   */
  getDescriptionHeight() {
    const element = document.getElementsByClassName('divDescription') as HTMLCollectionOf<HTMLElement>;
    const height = element[this.index].clientHeight;
    const btnDiv = document.getElementById(this.index.toString());
    if (height < 63) {
      btnDiv.setAttribute('style', 'display:none;');
    }
  }

  getDescriptionClass() {
    if (!this.showLongDescription) {
      return 'hideLongDescription';
    } else { return 'longDescription'; }
  }

  toggleLongDescription() {
    this.showLongDescription = !this.showLongDescription;
  }

  scheduleNotification() {

    // unique notification id
    const notificationID = this.event.id * 10;

    if (!this.isNotificationScheduled) {
      const beginDate = moment(this.event.timestart * 1000);
      const currentTime = moment();
      const hoursToBegin = moment.duration(beginDate.diff(currentTime)).asHours();

      const oneWeekBefore = moment(beginDate).subtract(1, 'weeks');
      const oneDayBefore = moment(beginDate).subtract(1, 'days');
      const threeHoursBefore = moment(beginDate).subtract(3, 'hours');
      const oneHourBefore = moment(beginDate).subtract(1, 'hours');

      let messageWeek;
      let messageTomorrow;
      let messageHour;

      // constructs notification messages
      this.translate.get('statusMessage.notification.pushMessage_1_0').subscribe((value) => { messageWeek = value; });
      messageWeek = messageWeek.concat(beginDate.format('ll').toLocaleString());
      this.translate.get('statusMessage.notification.pushMessage_1_1').subscribe((value) => { messageWeek = messageWeek.concat(value); });
      messageWeek = messageWeek.concat(beginDate.format('LT').toLocaleString());
      this.translate.get('statusMessage.notification.pushMessage_3_2').subscribe((value) => { messageWeek = messageWeek.concat(value); });

      this.translate.get('statusMessage.notification.pushMessage_2').subscribe((value) => { messageTomorrow = value; });
      this.translate.get('statusMessage.notification.pushMessage_1_1').subscribe((value) => {
        messageTomorrow = messageTomorrow.concat(value); });
      messageTomorrow = messageTomorrow.concat(beginDate.format('LT').toLocaleString());
      this.translate.get('statusMessage.notification.pushMessage_3_2').subscribe((value) => {
        messageTomorrow = messageTomorrow.concat(value); });

      this.translate.get('statusMessage.notification.pushMessage_3_0').subscribe((value) => { messageHour = value; });
      this.translate.get('statusMessage.notification.pushMessage_1_1').subscribe((value) => { messageHour = messageHour.concat(value); });
      messageHour = messageHour.concat(beginDate.format('LT').toLocaleString());
      this.translate.get('statusMessage.notification.pushMessage_3_1').subscribe((value) => { messageHour = messageHour.concat(value); });

      if (hoursToBegin > 168) {
        // case 1: more than 7 days => the user gets a notification one week before and the day before
        this.localNotifications.schedule([{
          id: notificationID,
          text: messageWeek,
          title: this.processMoodleContents(this.event.name),
          trigger: {at: new Date(oneWeekBefore.toDate())},
          led: 'FF0000',
          sound: null
       }, {
          id: notificationID + 1,
          text: messageTomorrow,
          title: this.processMoodleContents(this.event.name),
          trigger: {at: new Date(oneDayBefore.toDate())},
          led: 'FF0000',
          sound: null
       }]);
      } else if (hoursToBegin > 24) {
        // case 2: more than 1 day but less than 7 days => the user gets a notification 24 hours before the appointment
        this.localNotifications.schedule({
          id: notificationID,
          text: messageTomorrow,
          title: this.processMoodleContents(this.event.name),
          trigger: {at: new Date(oneDayBefore.toDate())},
          led: 'FF0000',
          sound: null
        });
      } else if (hoursToBegin > 3) {
        // case 3: less than 24 hours but more than 3 hours => the user gets a notification three hours before the appointment
        this.localNotifications.schedule({
          id: notificationID,
          text: messageHour,
          title: this.processMoodleContents(this.event.name),
          trigger: {at: new Date(threeHoursBefore.toDate())},
          led: 'FF0000',
          sound: null
        });
      } else {
        // case 4: less than 3 hours => the user gets a notification one houre before the appointment
        this.localNotifications.schedule({
          id: notificationID,
          text: messageHour,
          title: this.processMoodleContents(this.event.name),
          trigger: {at: new Date(oneHourBefore.toDate())},
          led: 'FF0000',
          sound: null
        });
      }
      this.isNotificationScheduled = true;
      this.saveScheduledEvent();
      this.isScheduledAlert();

    } else {
      this.isCanceledAlert();
    }

  }

  /**
   * adds eventID to scheduledEvent-array that gets saved to storage
   */
  saveScheduledEvent() {
    if (this.isPushAllowed) {
      const notificationID = this.event.id * 10;
      this.storage.get('scheduledEvents').then((array: string[]) => {
        let tmpArray;
        if (array && (array.length > 0)) {
          tmpArray = array;
          tmpArray.push(notificationID.toString());
        } else {
          tmpArray = [];
          tmpArray.push(notificationID.toString());
        }
        this.storage.set('scheduledEvents', tmpArray).then(data => {
          if (this.isHomePage) {
            this.notificationStatusChanged.emit();
          }
        });
      });
    }
  }

  /**
   * alert for the user
   * confirms that the notification has been scheduled
   */
  async isScheduledAlert() {
    if (this.isPushAllowed) {
      let notificationMessage, okMessage;
      this.translate.get('statusMessage.notification.scheduled').subscribe((value) => { notificationMessage = value; });
      this.translate.get('buttonLabel.ok').subscribe((value) => { okMessage = value; });

      const alert = await this.alertCtrl.create({
        message: notificationMessage,
        buttons: [okMessage]
      });
      await alert.present();
    }
  }

  cancelNotifications() {
    const notificationID = this.event.id * 10;
    this.localNotifications.cancel(notificationID);
    this.localNotifications.cancel(notificationID + 1);
    this.storage.get('scheduledEvents').then((array: string[]) => {
      const tmpArray = [];
      let i;
      if (array) {
        for (i = 0; i < array.length; i++) {
          if (array[i] !== notificationID.toString()) {
            tmpArray.push(array[i]);
          }
        }
      }
      this.storage.set('scheduledEvents', tmpArray).then((data) => {
        if (this.isHomePage) {
          this.notificationStatusChanged.emit();
        }
      });
    });
    this.isNotificationScheduled = false;
  }

  /**
   * alert for the user
   * confirms that the notification has been cancelled
   */
  async isCanceledAlert() {
    let notificationMessage, yesMessage, noMessage;
    this.translate.get('statusMessage.notification.cancel').subscribe((value) => { notificationMessage = value; });
    this.translate.get('buttonLabel.yes').subscribe((value) => { yesMessage = value; });
    this.translate.get('buttonLabel.no').subscribe((value) => { noMessage = value; });

    const alert = await this.alertCtrl.create({
      message: notificationMessage,
      buttons: [
        {
          text: noMessage,
          role: 'cancel'
        },
        {
          text: yesMessage,
          role: 'okay',
          handler: () => {
            this.cancelNotifications();
          }
        }
      ]
    });
    await alert.present();
  }

}
