import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { TranslateService } from '@ngx-translate/core';
import { AlertService } from 'src/app/services/alert/alert.service';
import { AlertButton } from '@ionic/core';
import { HttpClient } from '@angular/common/http';
import { IModuleConfig } from 'src/app/lib/config';
import { ConfigService } from 'src/app/services/config/config.service';
import { NavController } from '@ionic/angular';

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
    private http: HttpClient,
    private navCtrl: NavController
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
    const config_url = 'https://apiup.uni-potsdam.de/endpoints/staticContent/2.0/config.json';
    this.http.get<IModuleConfig[]>(config_url).subscribe((serverConfig: IModuleConfig[]) => {
      if (serverConfig[0].appVersion >= ConfigService.configs[0].appVersion) {
        this.moduleConfigList = serverConfig;
      } else { this.moduleConfigList = ConfigService.configs; }
      this.setFilteredItems();
    }, error => {
      console.log(error);
      this.moduleConfigList = ConfigService.configs;
      this.setFilteredItems();
    });
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

}
