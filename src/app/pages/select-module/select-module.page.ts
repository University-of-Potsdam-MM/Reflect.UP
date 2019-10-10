import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { TranslateService } from '@ngx-translate/core';
import { AlertService } from 'src/app/services/alert/alert.service';
import { AlertButton } from '@ionic/core';
import { ConfigService } from 'src/app/services/config/config.service';
import { NavController, PopoverController } from '@ionic/angular';
import { PopoverPage } from '../popover/popover.page';

@Component({
  selector: 'app-select-module',
  templateUrl: './select-module.page.html',
  styleUrls: ['./select-module.page.scss'],
})
export class SelectModulePage implements OnInit {

  activeSegment = 'faculty';
  searchTerm = '';
  moduleConfigList = [];
  facultyCourses = [];
  moduleCourses = [];
  logoPath = 'assets/imgs/logos/';

  constructor(
    private storage: Storage,
    private translate: TranslateService,
    private alert: AlertService,
    private navCtrl: NavController,
    private popoverCtrl: PopoverController
  ) { }

  ngOnInit() {
    this.presentTOS();
    this.getModules();
  }

  async presentTOS() {
    const agreeTOS = await this.storage.get('agreeTOS');
    if (!agreeTOS) {
      const buttons: AlertButton[] = [
        {
          text: this.translate.instant('buttonLabel.agree'),
          handler: () => {
            this.storage.set('agreeTOS', true);
          }
        }
      ];
      this.alert.showAlert({ messageI18nKey: 'templates.tos', headerI18nKey: 'statusMessage.tos.title' }, buttons);
    }
  }

  getModules() {
    this.moduleConfigList = JSON.parse(JSON.stringify(ConfigService.configs));
    this.setFilteredItems();
  }

  async setFilteredItems() {
    const tmpString = this.searchTerm.replace(/-/g, '');
    const filterResults = this.filterItems(tmpString);

    const alreadyLoggedInSessions = await this.storage.get('sessions');

    this.facultyCourses = [];
    this.moduleCourses = [];
    for (let i = 0; i < filterResults.length; i++) {

      if (alreadyLoggedInSessions) {
        for (let j = 0; j < alreadyLoggedInSessions.length; j++) {
          if (filterResults[i].courseID === alreadyLoggedInSessions[j].courseID) {
            filterResults[i].isChecked = true;
            filterResults[i].alreadyLoggedIn = true;
          }
        }
      }

      if (!filterResults[i].isChecked) { filterResults[i].isChecked = false; }

      if (filterResults[i].type === 'faculty') {
        this.facultyCourses.push(filterResults[i]);
      } else {
        this.moduleCourses.push(filterResults[i]);
      }
    }
  }

  filterItems(searchTerm) {
    return this.moduleConfigList.filter((item) => {
      return  (item.faculty.toLowerCase().replace(/-/g, '').indexOf(searchTerm.toLowerCase()) > -1) ||
              (item.title.toLowerCase().replace(/-/g, '').indexOf(searchTerm.toLowerCase()) > -1) ||
              (item.institution.toLowerCase().replace(/-/g, '').indexOf(searchTerm.toLowerCase()) > -1) ||
              (item.description.toLowerCase().replace(/-/g, '').indexOf(searchTerm.toLowerCase()) > -1) ||
              (item.courseID.toLowerCase().slice(4, 6).concat('/')
                .concat(item.courseID.slice(6, 8)).indexOf(searchTerm.toLowerCase()) > -1);
    });
  }

  selectConfigs() {
    const enrollCourses = [];

    for (let i = 0; i < this.facultyCourses.length; i++) {
      if (this.facultyCourses[i].isChecked && !this.facultyCourses[i].alreadyLoggedIn) {
        enrollCourses.push(this.facultyCourses[i]);
      }
    }

    for (let i = 0; i < this.moduleCourses.length; i++) {
      if (this.moduleCourses[i].isChecked && !this.moduleCourses[i].alreadyLoggedIn) {
        enrollCourses.push(this.moduleCourses[i]);
      }
    }

    this.storage.set('coursesToLogin', enrollCourses);
    this.navCtrl.navigateForward('/login');
  }

  checkLoginCondition() {
    let modulesChecked = false;

    for (let i = 0; i < this.facultyCourses.length; i++) {
      if (this.facultyCourses[i].isChecked && !this.facultyCourses[i].alreadyLoggedIn) {
        modulesChecked = true;
        break;
      }
    }

    for (let i = 0; i < this.moduleCourses.length; i++) {
      if (this.moduleCourses[i].isChecked && !this.moduleCourses[i].alreadyLoggedIn) {
        modulesChecked = true;
        break;
      }
    }

    return !modulesChecked;
  }

  async presentPopover(myEvent) {
    const popover = await this.popoverCtrl.create({
      component: PopoverPage,
      componentProps: { moduleConfigList: this.moduleConfigList, activeSegment: this.activeSegment },
      event: myEvent,
      keyboardClose: true
    });
    popover.present();

    popover.onWillDismiss().then(response => {
      if (response && response.data) {
        this.searchTerm = response.data.searchTerm;
        this.activeSegment = response.data.activeSegment;
        this.setFilteredItems();
      }
    });
  }

}
