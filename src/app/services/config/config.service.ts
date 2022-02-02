import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { IModuleConfig } from "src/app/lib/config";
import { Storage } from "@ionic/storage-angular";
import { LoggingService, Logger } from "ionic-logging-service";

@Injectable({
  providedIn: "root",
})
export class ConfigService {
  static configs: IModuleConfig[];

  constructor(
    private http: HttpClient,
    private storage: Storage,
    private loggingService: LoggingService
  ) {}

  /**
   * loads config file.
   * https://blogs.msdn.microsoft.com/premier_developer/2018/03/01/angular-how-to-editable-config-files/
   *
   */
  load(uri: string) {
    const logger: Logger = this.loggingService.getLogger("[/config-service]");
    const config_url =
      "https://apiup.uni-potsdam.de/endpoints/staticContent/2.0/config.json";
    return new Promise<void>((resolve, reject) => {
      this.http
        .get(config_url)
        .toPromise()
        .then((serverConfig: IModuleConfig[]) => {
          logger.debug(
            "load()",
            "successfully fetched remote config",
            serverConfig
          );

          this.http.get(uri).subscribe(
            (localConfig: IModuleConfig[]) => {
              logger.debug(
                "load()",
                "successfully loaded local config",
                localConfig
              );
              if (serverConfig[0].appVersion >= localConfig[0].appVersion) {
                ConfigService.configs = serverConfig;

                if (serverConfig[0].appVersion > localConfig[0].appVersion) {
                  this.storage.set("appUpdateAvailable", true);
                  logger.debug(
                    "load()",
                    "server has a newer app version -- update available"
                  );
                }
              } else {
                ConfigService.configs = localConfig;
              }
              resolve();
            },
            (error) => {
              ConfigService.configs = serverConfig;
              logger.error("load()", "error while loading local config", error);
              resolve();
            }
          );
        })
        .catch((errorServer) => {
          logger.error(
            "load()",
            "error while fetching remote config",
            errorServer
          );
          this.http.get(uri).subscribe(
            (localConfig: IModuleConfig[]) => {
              logger.debug(
                "load()",
                "successfully loaded local config",
                localConfig
              );
              ConfigService.configs = localConfig;
              resolve();
            },
            (error) => {
              reject(`Could not load file '${uri}'`);
              logger.error("load()", `Could not load file '${uri}'`, error);
            }
          );
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

    return undefined;
  }
}
