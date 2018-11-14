import { SettingsPage } from './../settings/settings';
import { ImpressumPage } from './../impressum/impressum';
import { PopoverPage } from './../popover/popover';
import { DisagreeTosPage } from './../disagree-tos/disagree-tos';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, MenuController, PopoverController } from 'ionic-angular';
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
  private configStorageKey:string = "config";
  config_url = "https://apiup.uni-potsdam.de/endpoints/staticContent/2.0/config.json";

  searchTerm: string = '';
  searchItems: any;

  tosMessageDE;
  tosMessageEN;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
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
    this.getDescriptions();
    this.presentTOS();
  }

  presentTOS() {
    this.storage.get("fallbackConfig").then((config:IModuleConfig) => {
      if (config) {
        this.tosMessageDE = config.tosTemplateDE;
        this.tosMessageEN = config.tosTemplateEN;
      }
    });

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
    })
  }

  /**
   * getDescriptions
   *
   * fetches module config descriptions from ModuleProvider
   */
  public getDescriptions():void {

    this.connection.checkOnline().subscribe((online) => {
      if (online) {
        this.http.get<IModuleConfig[]>(this.config_url).subscribe((configList:IModuleConfig[]) => {
          for (let config of configList) {
            this.moduleConfigList.push(
              {
                id:           config.id,
                title:        config.title,
                institution:  config.institution,
                description:  config.description,
                uniLogo:      config.uniLogo,
                courseID:     config.courseID
              }
            );
          }
          if (this.navParams.data.searchTerm) {
            this.searchTerm = this.navParams.data.searchTerm;
            this.setFilteredItems();
          } else {
            this.setFilteredItems();
          }
        });
      } else {
        this.http.get<IModuleConfig[]>(this.jsonPath).subscribe((localConfigList:IModuleConfig[]) => {
          for (let config of localConfigList) {
            this.moduleConfigList.push(
              {
                id:           config.id,
                title:        config.title,
                institution:  config.institution,
                description:  config.description,
                uniLogo:      config.uniLogo,
                courseID:     config.courseID
              }
            );
          }
          if (this.navParams.data.searchTerm) {
            this.searchTerm = this.navParams.data.searchTerm;
            this.setFilteredItems();
          } else {
            this.setFilteredItems();
          }
        });
      }
    });
  }

  /**
   * selectConfig
   *
   * selects a chosen module and forwards the user to the LoginPage
   * @param index
   */
  public selectConfig(index:number):void {

    this.connection.checkOnline().subscribe((online) => {
      if (online) {
        this.http.get<IModuleConfig[]>(this.config_url).subscribe((configList:IModuleConfig[]) => {
          this.http.get<IModuleConfig[]>(this.jsonPath).subscribe((localConfigList:IModuleConfig[]) => {
            for (let config of configList) {
              if (config.id == index) {
                for (let localConfig of localConfigList) {
                  if (localConfig.id == config.id) {
                    // check for new appVersion and notify user if new update is available
                    this.storage.get("appUpdateAvailable").then((appUpdateStorage) => {
                      if (appUpdateStorage != config.appVersion) {
                        if (localConfig.appVersion) {
                          if (config.appVersion > localConfig.appVersion) {
                            this.storage.set("appUpdateAvailable", 1);
                          } else { this.storage.set("appUpdateAvailable", config.appVersion); }
                        } else { this.storage.set("appUpdateAvailable", 1); }
                      }
                    });
                  }
                }
                // store found config in storage
                this.storage.set(this.configStorageKey, config);
                this.navCtrl.push(LoginPage);
                break;
              }
            }
          });
        });
      } else {
        this.http.get<IModuleConfig[]>(this.jsonPath).subscribe((localConfigList:IModuleConfig[]) => {
          for (let config of localConfigList) {
            if (config.id == index) {
              // store found config in storage
              this.storage.set(this.configStorageKey, config);
              this.navCtrl.push(LoginPage);
              break;
            }
          }
        });
      }
    });
  }

  setFilteredItems() {
    var tmpString = this.searchTerm.replace(/-/g,'');
    this.searchItems = this.filterItems(tmpString);
  }

  filterItems(searchTerm) {
    return this.moduleConfigList.filter((item) => {
      return (item.title.toLowerCase().replace(/-/g,'').indexOf(searchTerm.toLowerCase()) > -1) ||
              (item.institution.toLowerCase().replace(/-/g,'').indexOf(searchTerm.toLowerCase()) > -1) ||
              (item.description.toLowerCase().replace(/-/g,'').indexOf(searchTerm.toLowerCase()) > -1) ||
              (item.courseID.toLowerCase().slice(4,6).concat('/').concat(item.courseID.slice(6,8)).indexOf(searchTerm.toLowerCase()) > -1);
    });
  }

  presentPopover(myEvent) {
    let popover = this.popoverCtrl.create(PopoverPage, this.moduleConfigList);
    popover.present({
      ev: myEvent
    });
  }

  openImpressum() {
    this.navCtrl.push(ImpressumPage);
  }

  openSettings() {
    this.navCtrl.push(SettingsPage, { hideTabBar: true });
  }

}
