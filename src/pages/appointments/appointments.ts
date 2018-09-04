import { Storage } from '@ionic/storage';
import { ConnectionProvider } from '../../providers/connection-provider/connection-provider';
import { Component } from '@angular/core';
import { IonicPage, AlertController, Platform } from 'ionic-angular';
import { EventProvider } from '../../providers/event-provider/event-provider';
import { AppointConfig, EventObject } from '../../lib/interfaces/appointm';
import { TranslateService } from '@ngx-translate/core';
import { Push } from '@ionic-native/push';
import { CalendarComponentOptions } from 'ion2-calendar';
import * as moment from 'moment';

@IonicPage()
@Component({
  selector: 'page-appointments',
  templateUrl: 'appointments.html',
})
export class AppointmentsPage {

  // boolean flags
  isLoaded;
  noAppointments;
  isPushAllowed;
  showBasicCalendar;
  showRangeCalendar;
  showAll;
  basicCalendarMode;
  rangeCalendarMode;
  isEventToday;
  isEventTomorrow;
  isEventThisWeek;
  isEventLater;
  showEventToday;
  showEventTomorrow;
  showEventThisWeek;
  showEventLater;

  // calendar variables
  date: string;
  type: 'moment';
  dateRange: { from: string; to: string; };
  optionsRange: CalendarComponentOptions = {
    pickMode: 'range',
    monthPickerFormat: ['JAN', 'FEB', 'MÄR', 'APR', 'MAI', 'JUN', 'JUL', 'AUG', 'SEP', 'OKT', 'NOV', 'DEZ']
  };
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

  constructor(private appointm: EventProvider,
              private translate: TranslateService,
              private alertCtrl: AlertController,
              private storage: Storage,
              private connection: ConnectionProvider,
              private push: Push,
              private platform: Platform)
              {
                this.showBasicCalendar = false;
                this.showRangeCalendar = false;
                this.showAll = true;
                this.rangeCalendarMode = false;
                this.basicCalendarMode = false;
                this.isEventToday = false;
                this.isEventTomorrow = false;
                this.isEventThisWeek = false;
                this.isEventLater = false;
                this.showEventToday = true;
                this.showEventTomorrow = true;
                this.showEventThisWeek = true;
                this.showEventLater = true;
                if (this.translate.currentLang == 'en') {
                  this.optionsRange.monthPickerFormat = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
                  this.optionsBasic.monthPickerFormat = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
                }
              }

  ngOnInit() {
    if (this.platform.is("cordova")) {
      this.push.hasPermission().then((res: any) => {
        if (res.isEnabled) {
          this.isPushAllowed = true;
        } else { this.isPushAllowed = false; }
      });
    }

    this.initEvents();
  }

  initEvents() {
    this.connection.checkOnline().subscribe(online => {
      if (online) {
        this.isLoaded = false;
        this.appointm.loadParams();

        this.appointm.readyObservable.subscribe(ready => {
          if (ready) {
            this.appointm.getAppointments().subscribe((appointConf:AppointConfig) => {
              if (appointConf.events) {
                this.storage.get("hiddenCards").then((array:string[]) => {
                  if (array) {
                    for (let event of appointConf.events) {
                      if (event.modulename != "feedback") {
                        var foundID = array.find(element => element == event.id.toString());
                        if (foundID != undefined) {
                          this.hiddenEvent[event.id] = true;
                        } else {
                          this.hiddenEvent[event.id] = false;
                        }
                        this.eventList.push(event);
                      }
                    }
                  } else {
                    for (let event of appointConf.events) {
                      if (event.modulename != "feedback") {
                        this.hiddenEvent[event.id] = false;
                        this.eventList.push(event);
                      }
                    }
                  }
                  if (this.eventList.length < 1) {
                    this.noAppointments = true;
                  }
                  this.tmpEventList = this.eventList;
                  this.checkEventDates();
                });
                
                this.storage.get("scheduledEvents").then((array:string[]) => {
                  var notificationID;
                  if (array) {
                    for (let event of appointConf.events) {
                      if (event.modulename != "feedback") {
                        notificationID = event.id * 10;
                        var foundID = array.find(element => element == notificationID.toString()); 
                        if (foundID != undefined) {
                          this.scheduledEvent[event.id] = true;
                        } else {
                          this.scheduledEvent[event.id] = false;
                        }
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
                this.noAppointments = true;
                this.isLoaded = true;
              }
            });
          }
        });
      } else {
        // there is no network connection
        this.showAlert("statusMessage.error.network");
      }
    });
  }

  checkEventDates() {
    let currentDate = moment();
    var i;
    for (i = 0; i < this.tmpEventList.length; i++) {
      var beginDate = moment(this.tmpEventList[i].timestart * 1000);
      var endDate = moment((this.tmpEventList[i].timestart + this.tmpEventList[i].timeduration) * 1000);
      if ((moment(beginDate).isSameOrBefore(currentDate, 'day')) && (moment(endDate).isSameOrAfter(currentDate, 'day'))) {
        // today
        this.eventToday[this.tmpEventList[i].id] = true;
        this.isEventToday = true;
      } else if ((moment(beginDate).isSameOrBefore(currentDate.add(1, 'day'), 'day')) && (moment(endDate).isSameOrAfter(currentDate.add(1, 'day'), 'day'))) {
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

  showAlert(alertTextKey:string) {
    let alert = this.alertCtrl.create({
      title: this.translate.instant("statusMessage.error.title"),
      subTitle: this.translate.instant(alertTextKey),
      buttons: [
        this.translate.instant("alertButton.ok")
      ]
    });
    alert.present();
  }

  pickDate($event) {
    // let delay = setTimeout(() => {
    //   this.showBasicCalendar = false;
    // }, 250);
    // console.log(delay);
    this.noAppointments = false;
    var i;
    this.eventList = [];
    for (i = 0; i < this.tmpEventList.length; i++) {
      var beginDate = moment(this.tmpEventList[i].timestart * 1000);
      var endDate = moment((this.tmpEventList[i].timestart + this.tmpEventList[i].timeduration) * 1000);
      if (moment(beginDate).isSame($event, 'day') || (moment(beginDate).isBefore($event) && moment(endDate).isSameOrAfter($event))) {
        this.eventList.push(this.tmpEventList[i]);
      }
    }
    if (this.eventList.length < 1) { this.noAppointments = true; }
  }

  pickRange($event) {
    // let delay = setTimeout(() => {
    //   this.showRangeCalendar = false;
    // }, 250);
    // console.log(delay);
    this.noAppointments = false;
    var i;
    this.eventList = [];
    for (i = 0; i < this.tmpEventList.length; i++) {
      var beginDate = moment(this.tmpEventList[i].timestart * 1000);
      var endDate = moment((this.tmpEventList[i].timestart + this.tmpEventList[i].timeduration) * 1000);
      if ((moment(beginDate).isSame($event.from, 'day'))|| (moment(beginDate).isBefore($event.from) && moment(endDate).isSameOrAfter($event.from)) || (moment(beginDate).isAfter($event.from) && (moment(beginDate).isSameOrBefore($event.to) || moment(beginDate).isSame($event.to, 'day')))) {
        this.eventList.push(this.tmpEventList[i]);
      }
    }
    if (this.eventList.length < 1) { this.noAppointments = true; }
  }

  resetCalendar() {
    this.showAll = true;
    this.noAppointments = false;
    this.basicCalendarMode = false;
    this.rangeCalendarMode = false;
    this.showBasicCalendar = false;
    this.showRangeCalendar = false;
    this.date = "";
    this.dateRange = { from: "", to: "" };
    this.eventList = this.tmpEventList;
    if (this.eventList.length < 1) { this.noAppointments = true; }
  }

}
