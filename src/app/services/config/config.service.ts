import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IModuleConfig } from 'src/app/lib/config';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  static configs: IModuleConfig[];

  constructor(
    private http: HttpClient
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
        (response: IModuleConfig[]) => {
          ConfigService.configs = response;
          console.log(ConfigService.configs);
          resolve();
        }
      ).catch(() => {
        this.http.get(uri).subscribe((response: IModuleConfig[]) => {
          ConfigService.configs = response;
          console.log(ConfigService.configs);
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
