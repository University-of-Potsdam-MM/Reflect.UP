import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IModuleConfig } from 'src/app/lib/config';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  static configs: IModuleConfig[];

  constructor(
    private http: HttpClient,
    private storage: Storage
    ) { }

  /**
   * loads config file.
   * https://blogs.msdn.microsoft.com/premier_developer/2018/03/01/angular-how-to-editable-config-files/
   *
   */
  load(uri: string) {
    const config_url = 'https://apiup.uni-potsdam.de/endpoints/staticContent/2.0/config.json';
    return new Promise<void>((resolve, reject) => {
      this.http.get(config_url).toPromise().then(
        (serverConfig: IModuleConfig[]) => {

          this.http.get(uri).subscribe((localConfig: IModuleConfig[]) => {
            if (serverConfig[0].appVersion >= localConfig[0].appVersion) {
              ConfigService.configs = serverConfig;

              if (serverConfig[0].appVersion > localConfig[0].appVersion) {
                this.storage.set('appUpdateAvailable', true);
              }
            } else { ConfigService.configs = localConfig; }
            resolve();
          }, () => {
            ConfigService.configs = serverConfig;
            resolve();
          });
        }
      ).catch(() => {
        this.http.get(uri).subscribe((localConfig: IModuleConfig[]) => {
          ConfigService.configs = localConfig;
          resolve();
        }, error => {
          reject(`Could not load file '${uri}'`);
          console.log('load' + error);
        });
      });
    });
  }

  getAll() {
    return ConfigService.configs;
  }

  getConfigById(courseID) {
    for (let i = 0; i < ConfigService.configs.length; i++) {
      if (ConfigService.configs[i].courseID === courseID) {
        return ConfigService.configs[i];
      }
    }
  }
}
