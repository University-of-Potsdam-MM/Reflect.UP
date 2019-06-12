import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IModuleConfig } from 'src/app/lib/config';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  static config: IModuleConfig;

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
        (response: IModuleConfig) => {
          ConfigService.config = response;
          resolve();
        }
      ).catch(() => {
        reject(`Could not load file '${uri}'`);
      });
    });
  }
}
