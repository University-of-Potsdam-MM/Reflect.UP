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

@Component({
  selector: 'app-appointments',
  templateUrl: './appointments.page.html',
  styleUrls: ['./appointments.page.scss'],
})
export class AppointmentsPage implements OnInit {

  // boolean flags
  isLoaded;
  noAppointments;
  isPushAllowed;
  showBasicCalendar = false;
  // showRangeCalendar = false;
  showAll = true;
  basicCalendarMode = false;
  // rangeCalendarMode = false;
  isEventToday = false;
  isEventTomorrow = false;
  isEventThisWeek = false;
  isEventLater = false;
  showEventToday = true;
  showEventTomorrow = true;
  showEventThisWeek = true;
  showEventLater = true;

  // calendar variables
  date: string;
  type: 'moment';
  // dateRange: { from: string; to: string; };
  // optionsRange: CalendarComponentOptions = {
  //   pickMode: 'range',
  //   monthPickerFormat: ['JAN', 'FEB', 'MÄR', 'APR', 'MAI', 'JUN', 'JUL', 'AUG', 'SEP', 'OKT', 'NOV', 'DEZ']
  // };
  optionsBasic: CalendarComponentOptions = {
    monthPickerFormat: ['JAN', 'FEB', 'MÄR', 'APR', 'MAI', 'JUN', 'JUL', 'AUG', 'SEP', 'OKT', 'NOV', 'DEZ']
  };

  tmpEventList: EventObject[] = []; // backup list
  eventList: EventObject[] = [];    // where all the event object are stored
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
  ) { }

  async ngOnInit() {
    this.sessions = await this.storage.get('sessions');

    if (this.translate.currentLang === 'en') {
      // this.optionsRange.monthPickerFormat = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
      this.optionsBasic.monthPickerFormat = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    }

    if (this.platform.is('cordova')) {
      this.push.hasPermission().then((res: any) => {
        if (res.isEnabled) {
          this.isPushAllowed = true;
        } else { this.isPushAllowed = false; }
      });
    }

    this.initEvents();
  }

  initEvents(refresher?, ionRefresh?) {
    this.connection.checkOnline().subscribe(online => {
      if (online || !ionRefresh) {
        if (!ionRefresh) { this.isLoaded = false; }

        const tmpEventArray = [];
        const loop = dLoop(this.sessions, (itm, idx, fin) => {
          const config: IModuleConfig = this.configService.getConfigById(itm.courseID);

          this.appointm.getAppointments(config, itm.token, ionRefresh).subscribe(async (appointConfig: AppointConfig) => {
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

                  tmpEventArray.push(event);
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
          if (tmpEventArray.length < 1) { this.noAppointments = true; }
          if (refresher) { refresher.target.complete(); }
          this.eventList = tmpEventArray;
          this.tmpEventList = tmpEventArray;
          this.isLoaded = true;
          this.checkEventDates();
          console.log(this.eventList);
        });
      } else {
        // there is no network connection
        this.showAlert('statusMessage.error.network');
      }
    });
  }

  checkEventDates() {
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
          this.isEventToday = true;
        }
      } else if ((moment(beginDate).isSameOrBefore(tommorowDate, 'day')) && (moment(endDate).isSameOrAfter(tommorowDate, 'day'))) {
        // tomorrow
        this.eventTomorrow[this.tmpEventList[i].id] = true;
        this.isEventTomorrow = true;
      } else if ((moment(beginDate).isSameOrBefore(currentDate, 'week')) && (moment(endDate).isSameOrAfter(currentDate, 'week'))) {
        // this week
        this.eventThisWeek[this.tmpEventList[i].id] = true;
        this.isEventThisWeek = true;
      } else {
        // later
        this.eventLater[this.tmpEventList[i].id] = true;
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

  // pickRange($event) {
  //   console.log($event);
  //   this.noAppointments = false;
  //   let i;
  //   this.eventList = [];
  //   for (i = 0; i < this.tmpEventList.length; i++) {
  //     const beginDate = moment(this.tmpEventList[i].timestart * 1000);
  //     const endDate = moment((this.tmpEventList[i].timestart + this.tmpEventList[i].timeduration) * 1000);
  //     if ((moment(beginDate).isSame($event.from, 'day'))
  //     || (moment(beginDate).isBefore($event.from)
  //     && moment(endDate).isSameOrAfter($event.from))
  //     || (moment(beginDate).isAfter($event.from)
  //     && (moment(beginDate).isSameOrBefore($event.to)
  //     || moment(beginDate).isSame($event.to, 'day')))) {
  //       this.eventList.push(this.tmpEventList[i]);
  //     }
  //   }
  //   if (this.eventList.length < 1) { this.noAppointments = true; }
  // }

  resetCalendar() {
    this.showAll = true;
    this.noAppointments = false;
    this.basicCalendarMode = false;
    this.showBasicCalendar = false;
    // this.showRangeCalendar = false;
    // this.rangeCalendarMode = false;
    this.date = '';
    // this.dateRange = { from: '', to: '' };
    this.eventList = this.tmpEventList;
    if (this.eventList.length < 1) { this.noAppointments = true; }
  }

}
