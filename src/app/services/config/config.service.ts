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
    return new Promise<void>((resolve, reject) => {
      this.http.get(uri).toPromise().then(
        (response: IModuleConfig[]) => {
          ConfigService.configs = response;
          resolve();
        }
      ).catch(
        (response: any) => {
          reject(`Could not load file '${uri}'`);
          console.log('load' + response);
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
