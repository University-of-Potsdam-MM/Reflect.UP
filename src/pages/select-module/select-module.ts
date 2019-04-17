import { SettingsPage } from './../settings/settings';
import { ImpressumPage } from './../impressum/impressum';
import { PopoverPage } from './../popover/popover';
import { DisagreeTosPage } from './../disagree-tos/disagree-tos';
import { Component } from '@angular/core';
import { IonicPage, NavController, AlertController, MenuController, PopoverController } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { IModuleConfig } from '../../lib/interfaces/config';
import { Storage } from '@ionic/storage';
import { LoginPage } from '../login/login';
import { ConnectionProvider } from '../../providers/connection-provider/connection-provider';
import { TranslateService } from '@ngx-translate/core';

/**
 * SelectModulePage
 *
 * makes the User select a module
 */
@IonicPage()
@Component({
  selector: 'page-select-module',
  templateUrl: 'select-module.html'
})
export class SelectModulePage {

  public moduleConfigList = [];
  public logoPath:string = "assets/imgs/logos/"
  private jsonPath:string = 'assets/json/config.json';

  config_url = "https://apiup.uni-potsdam.de/endpoints/staticContent/2.0/config.json";

  searchTerm: string = '';
  facultyCourses = [];
  moduleCourses = [];

  tosMessageDE;
  tosMessageEN;
  activeSegment;

  constructor(
    public navCtrl: NavController,
    public http: HttpClient,
    private translate: TranslateService,
    private connection: ConnectionProvider,
    private storage: Storage,
    private alertCtrl: AlertController,
    private menu: MenuController,
    private popoverCtrl: PopoverController,
    ) {
      this.menu.enable(false,"sideMenu");
  }

  ngOnInit() {
    this.presentTOS();
    this.getDescriptions();
    this.activeSegment = 'faculty';
  }

  presentTOS() {
    let jsonPath:string = 'assets/json/config.json';
    this.http.get<IModuleConfig[]>(jsonPath).subscribe((jsonConfigList:IModuleConfig[]) => {
      this.storage.set("fallbackConfig", jsonConfigList[0]);
      let config = jsonConfigList[0];
      this.tosMessageDE = config.tosTemplateDE;
      this.tosMessageEN = config.tosTemplateEN;

      this.storage.get("ToS").then((ToS) => {
        if (ToS != "agree") {
          var msg;
          if (this.translate.currentLang == "de") {
            msg = this.tosMessageDE;
          } else { msg = this.tosMessageEN; }
          let alert = this.alertCtrl.create({
            title: this.translate.instant('statusMessage.tos.title'),
            message: msg,
            buttons: [
              {
                text: this.translate.instant('buttonLabel.disagree'),
                role: 'disagree',
                handler: () => {
                  this.storage.set("ToS", "disagree");
                  this.navCtrl.setRoot(DisagreeTosPage);
                }
              },
              {
                text: this.translate.instant('buttonLabel.agree'),
                role: 'agree',
                handler: () => {
                  this.storage.set("ToS", "agree");
                }
              }
            ],
            enableBackdropDismiss: false,
          });
          alert.present();
        }
      });
    });
  }

  /**
   * getDescriptions
   *
   * fetches module config descriptions from ModuleProvider
   */
  public getDescriptions():void {
    this.connection.checkOnline().subscribe(online => {
      this.http.get<IModuleConfig[]>(this.jsonPath).subscribe((jsonConfigList:IModuleConfig[]) => {
        if (online) {
          this.http.get<IModuleConfig[]>(this.config_url).subscribe((fetchedConfigList:IModuleConfig[]) => {
            if (jsonConfigList[0].appVersion > fetchedConfigList[0].appVersion) {
              this.moduleConfigList = jsonConfigList;
            } else { this.moduleConfigList = fetchedConfigList; }

            this.setFilteredItems();
          });
        } else {
          this.moduleConfigList = jsonConfigList;
          this.setFilteredItems();
        }
      });
    });
  }

  /**
   * selectConfig
   *
   * selects a chosen module and forwards the user to the LoginPage
   * @param index
   */
  public selectConfig(courseID:number):void {
    for (let config of this.moduleConfigList) {
      if (config.courseID == courseID) {
        // store found config in storage
        this.storage.set("config", config);
        this.navCtrl.push(LoginPage);
        break;
      }
    }
  }

  setFilteredItems() {
    var tmpString = this.searchTerm.replace(/-/g,'');
    const filterResults = this.filterItems(tmpString);

    this.facultyCourses = [];
    this.moduleCourses = [];
    for (let i = 0; i < filterResults.length; i++) {
      if (filterResults[i].type === 'faculty') {
        this.facultyCourses.push(filterResults[i]);
      } else {
        this.moduleCourses.push(filterResults[i]);
      }
    }
  }

  filterItems(searchTerm) {
    return this.moduleConfigList.filter((item) => {
      return  (item.faculty.toLowerCase().replace(/-/g,'').indexOf(searchTerm.toLowerCase()) > -1) ||
              (item.title.toLowerCase().replace(/-/g,'').indexOf(searchTerm.toLowerCase()) > -1) ||
              (item.institution.toLowerCase().replace(/-/g,'').indexOf(searchTerm.toLowerCase()) > -1) ||
              (item.description.toLowerCase().replace(/-/g,'').indexOf(searchTerm.toLowerCase()) > -1) ||
              (item.courseID.toLowerCase().slice(4,6).concat('/').concat(item.courseID.slice(6,8)).indexOf(searchTerm.toLowerCase()) > -1);
    });
  }

  presentPopover(myEvent) {
    let popover = this.popoverCtrl.create(PopoverPage, { modules: this.moduleConfigList, activeSegment: this.activeSegment });
    popover.present({ ev: myEvent });
    popover.onWillDismiss(data => {
      if (data) {
        this.searchTerm = data.searchTerm;
        this.activeSegment = data.activeSegment;
        this.setFilteredItems();
      }
    });
  }

  openImpressum() {
    this.navCtrl.push(ImpressumPage);
  }

  openSettings() {
    this.navCtrl.push(SettingsPage, { hideTabBar: true });
  }

}
