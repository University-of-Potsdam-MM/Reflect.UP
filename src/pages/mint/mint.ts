import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { IModuleConfig, IMintObject } from '../../lib/interfaces/config';
import { Storage } from '@ionic/storage';

@IonicPage()
@Component({
  selector: 'page-mint',
  templateUrl: 'mint.html',
})
export class MintPage {

  mintDetails:IMintObject[] = []; 
  mintDetailsAll:IMintObject[] = [];
  configLoaded = false;
  availableSubjects = [];
  chosenSubjects;

  constructor(public navCtrl: NavController, public navParams: NavParams, private storage:Storage) {
  }

  ngOnInit() {
    this.storage.get("config").then((config:IModuleConfig) => {
      this.mintDetailsAll = this.convertToArray(config.mintDetails);
      this.mintDetails = JSON.parse(JSON.stringify(this.mintDetailsAll));
      this.getSubjects();
      this.configLoaded = true;
    });
  }

  convertToArray(toConvert) { // convert everything to an array so you can handle it universally 
    if (Array.isArray(toConvert)) {
      return toConvert;
    } else {
      var tmp = [];
      tmp.push(toConvert);
      return tmp;
    }
  }

  isInArray(array, value) { // checks if value is in array
    var i;
    var found = false;
    for (i = 0; i < array.length; i++) {
      if (array[i] == value) {
        found = true;
      }
    }
    return found;
  }

  getSubjects() {
    var i,j,k;
    for (i = 0; i < this.mintDetailsAll.length; i++) {
      for (j = 0; j < this.mintDetailsAll[i].schedule.length; j++) {
        let tmpStrings = this.mintDetailsAll[i].schedule[j].subject.split(",");
        for (k = 0; k < tmpStrings.length; k++) {
          if (!this.isInArray(this.availableSubjects, tmpStrings[k])) {
            this.availableSubjects.push(tmpStrings[k]);
          }
        }
      }
    }
  }

  changeSchedule() {
    var i,j,k;

    // // reset schedule that
    for (i = 0; i < this.mintDetails.length; i++) {
      this.mintDetails[i].schedule = [];
    }

    if (this.chosenSubjects.length > 0) {
      // check tutors that teach a chosen subject, add them to the schedule
      for (i = 0; i < this.mintDetailsAll.length; i++) {
        for (j = 0; j < this.mintDetailsAll[i].schedule.length; j++) {
          var hits = 0;
          for (k = 0; k < this.chosenSubjects.length; k++) {
            if (this.mintDetailsAll[i].schedule[j].subject.includes(this.chosenSubjects[k].trim())) {
              hits += 1;
            }
            if (hits == this.chosenSubjects.length) {
              if (!this.isInArray(this.mintDetails[i].schedule, this.mintDetailsAll[i].schedule[j])) {
                this.mintDetails[i].schedule.push(this.mintDetailsAll[i].schedule[j]);
              }
            }
          }
        }
      }
    } else {
      for (i = 0; i < this.mintDetailsAll.length; i++) {
        this.mintDetails[i].schedule = JSON.parse(JSON.stringify(this.mintDetailsAll[i].schedule));
      }
    }

  }

}
