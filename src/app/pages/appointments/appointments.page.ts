import { Component, OnInit } from '@angular/core';
import { EventObject, AppointConfig } from 'src/app/lib/appointm';
import { CalendarComponentOptions } from 'ion2-calendar';
import { EventService } from 'src/app/services/event/event.service';
import { TranslateService } from '@ngx-translate/core';
import { AlertController, Platform } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { ConnectionService } from 'src/app/services/connection/connection.service';
import { Push } from '@ionic-native/push/ngx';
import * as moment from 'moment';
import { IModuleConfig } from 'src/app/lib/config';
import * as dLoop from 'delayed-loop';
import { ISession } from 'src/app/services/login-provider/interfaces';
import { ConfigService } from 'src/app/services/config/config.service';
import { AbstractPage } from '../abstract-page';

@Component({
  selector: 'app-appointments',
  templateUrl: './appointments.page.html',
  styleUrls: ['./appointments.page.scss'],
})
export class AppointmentsPage extends AbstractPage implements OnInit {

  // boolean flags
  isLoaded;
  noAppointments = false;
  isPushAllowed;
  showBasicCalendar = false;

  showAll = true;
  basicCalendarMode = false;

  isEventToday = false;
  isEventTomorrow = false;
  isEventThisWeek = false;
  isEventLater = false;

  showEventToday = true;
  showEventTomorrow = false;
  showEventThisWeek = false;
  showEventLater = false;

  // calendar variables
  date: string;
  type: 'moment';

  optionsBasic: CalendarComponentOptions = {
    monthPickerFormat: ['JAN', 'FEB', 'MÄR', 'APR', 'MAI', 'JUN', 'JUL', 'AUG', 'SEP', 'OKT', 'NOV', 'DEZ']
  };

  tmpEventList: EventObject[] = []; // backup list
  eventList: EventObject[] = [];    // where all the event object are stored

  eventListToday: EventObject[] = [];
  eventListTomorrow: EventObject[] = [];
  eventListThisWeek: EventObject[] = [];
  eventListLater: EventObject[] = [];

  hiddenEvent: boolean[] = [];      // whether event with event.id is hidden (hiddenEvent[event.id] == true)
  scheduledEvent: boolean[] = [];   // whether event with event.id has scheduled notification (scheduledEvent[event.id] == true)

  eventToday: boolean[] = [];
  eventTomorrow: boolean[] = [];
  eventThisWeek: boolean[] = [];
  eventLater: boolean[] = [];

  sessions: ISession[];

  constructor(
    private appointm: EventService,
    private translate: TranslateService,
    private alertCtrl: AlertController,
    private storage: Storage,
    private connection: ConnectionService,
    private push: Push,
    private platform: Platform,
    private configService: ConfigService
  ) {
    super();
  }

  ngOnInit() {
    if (this.translate.currentLang === 'en') {
      this.optionsBasic.monthPickerFormat = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    }

    if (this.platform.is('cordova') && (this.platform.is('ios') || this.platform.is('android'))) {
      this.push.hasPermission().then((res: any) => {
        if (res.isEnabled) {
          this.logger.debug('ngOnInit()', 'push is allowed');
          this.isPushAllowed = true;
        } else {
          this.isPushAllowed = false;
          this.logger.debug('ngOnInit()', 'push is forbidden');
        }
      });
    }

    this.initEvents();
  }

  async initEvents(refresher?, ionRefresh?) {
    this.sessions = await this.storage.get('sessions');
    this.connection.checkOnline().subscribe(online => {
      if (online || !ionRefresh) {
        if (!ionRefresh) { this.isLoaded = false; }

        const tmpEventArray = [];
        this.eventList = [];
        this.tmpEventList = [];
        this.hiddenEvent = [];
        this.scheduledEvent = [];
        const loop = dLoop(this.sessions, (itm, idx, fin) => {
          if (!itm.isHidden) {
            const config: IModuleConfig = this.configService.getConfigById(itm.courseID);

            this.appointm.getAppointments(config, itm.token, ionRefresh).subscribe(async (appointConfig: AppointConfig) => {
              this.logger.debug('initEvents()', 'successfully fetched appointments', appointConfig);
              if (appointConfig && appointConfig.events) {
                const hiddenArray = await this.storage.get('hiddenCards');
                const scheduledArray = await this.storage.get('scheduledEvents');
                let notificationID;
                for (const event of appointConfig.events) {
                  if (event.modulename !== 'feedback') {
                    let foundHidden;
                    let foundScheduled;

                    // check if event was previously hidden by the user
                    if (hiddenArray) { foundHidden = hiddenArray.find(element => element === event.id.toString()); }
                    if (foundHidden !== undefined) {
                      this.hiddenEvent[event.id] = true;
                    } else { this.hiddenEvent[event.id] = false; }

                    // check if user has scheduled a notification for the event
                    notificationID = event.id * 10;
                    if (scheduledArray) { foundScheduled = scheduledArray.find(element => element === notificationID.toString()); }
                    if (foundScheduled !== undefined) {
                      this.scheduledEvent[event.id] = true;
                    } else { this.scheduledEvent[event.id] = false; }

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
                  }
                }
              }

              fin();
            }, error => {
              this.logger.error('initEvents()', 'error fetching appointments', error);
              fin();
            });
          } else { fin(); }
        });

        loop.then(() => {
          if (tmpEventArray.length < 1) { this.noAppointments = true; }
          if (refresher) { refresher.target.complete(); }
          this.eventList = tmpEventArray.sort((a: EventObject, b: EventObject) => a.timestart - b.timestart);
          this.tmpEventList = tmpEventArray.sort((a: EventObject, b: EventObject) => a.timestart - b.timestart);
          this.isLoaded = true;
          this.checkEventDates();
        });
      } else {
        // there is no network connection
        this.showAlert('statusMessage.error.network');
      }
    });
  }

  checkEventDates() {
    this.eventListToday = [];
    this.eventListTomorrow = [];
    this.eventListThisWeek = [];
    this.eventListLater = [];

    let currentDate, tommorowDate, i, beginDate, endDate;
    for (i = 0; i < this.tmpEventList.length; i++) {
      beginDate = moment(this.tmpEventList[i].timestart * 1000);
      endDate = moment((this.tmpEventList[i].timestart + this.tmpEventList[i].timeduration) * 1000);
      const tmpDate = new Date();
      currentDate = moment(tmpDate);
      tommorowDate = moment(tmpDate).add(1, 'day');
      if (moment(beginDate).isSameOrBefore(currentDate, 'day')) {
        if (moment(endDate).isSameOrAfter(currentDate, 'day')) {
          // today
          this.eventToday[this.tmpEventList[i].id] = true;
          this.eventListToday.push(this.tmpEventList[i]);
          this.isEventToday = true;
        }
      } else if ((moment(beginDate).isSameOrBefore(tommorowDate, 'day')) && (moment(endDate).isSameOrAfter(tommorowDate, 'day'))) {
        // tomorrow
        this.eventTomorrow[this.tmpEventList[i].id] = true;
        this.eventListTomorrow.push(this.tmpEventList[i]);
        this.isEventTomorrow = true;
      } else if ((moment(beginDate).isSameOrBefore(currentDate, 'week')) && (moment(endDate).isSameOrAfter(currentDate, 'week'))) {
        // this week
        this.eventThisWeek[this.tmpEventList[i].id] = true;
        this.eventListThisWeek.push(this.tmpEventList[i]);
        this.isEventThisWeek = true;
      } else {
        // later
        this.eventLater[this.tmpEventList[i].id] = true;
        this.eventListLater.push(this.tmpEventList[i]);
        this.isEventLater = true;
      }
    }
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

  pickDate($event) {
    this.noAppointments = false;
    let i;
    this.eventList = [];
    for (i = 0; i < this.tmpEventList.length; i++) {
      const beginDate = moment(this.tmpEventList[i].timestart * 1000);
      const endDate = moment((this.tmpEventList[i].timestart + this.tmpEventList[i].timeduration) * 1000);
      if (moment(beginDate).isSame($event, 'day') || (moment(beginDate).isBefore($event) && moment(endDate).isSameOrAfter($event))) {
        this.eventList.push(this.tmpEventList[i]);
      }
    }
    if (this.eventList.length < 1) { this.noAppointments = true; }
  }

  resetCalendar() {
    this.showAll = true;
    this.noAppointments = false;
    this.basicCalendarMode = false;
    this.showBasicCalendar = false;
    this.date = '';
    this.eventList = this.tmpEventList;
    if (this.eventList.length < 1) { this.noAppointments = true; }
  }

  visibilityChanged(eventID) {
    if (!this.hiddenEvent[eventID]) {
      this.hiddenEvent[eventID] = true;
    } else { this.hiddenEvent[eventID] = false; }
  }

  async notificationStatusChanged() {
    const scheduledArray = await this.storage.get('scheduledEvents');
    let foundScheduled;
    let notificationID;
    this.scheduledEvent = [];

    for (const event of this.eventList) {
      // check if user has scheduled a notification for the event
      notificationID = event.id * 10;
      if (scheduledArray) { foundScheduled = scheduledArray.find(element => element === notificationID.toString()); }
      if (foundScheduled !== undefined) {
        this.scheduledEvent[event.id] = true;
      } else { this.scheduledEvent[event.id] = false; }
    }
  }

}
