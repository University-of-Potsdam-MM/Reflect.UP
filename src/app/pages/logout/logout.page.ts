import { Component, OnInit } from "@angular/core";
import { ISession } from "src/app/services/login-provider/interfaces";
import { Storage } from "@ionic/storage-angular";
import { DomSanitizer } from "@angular/platform-browser";
import { CacheService } from "ionic-cache";
import { Platform, NavController } from "@ionic/angular";
import { PushService } from "src/app/services/push/push.service";
import { IModuleConfig } from "src/app/lib/config";
import { ConfigService } from "src/app/services/config/config.service";
import { AppComponent } from "src/app/app.component";
import { AbstractPage } from "../abstract-page";
import { AlertService } from "src/app/services/alert/alert.service";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "app-logout",
  templateUrl: "./logout.page.html",
  styleUrls: ["./logout.page.scss"],
})
export class LogoutPage extends AbstractPage implements OnInit {
  sessions: ISession[];

  constructor(
    private storage: Storage,
    private sanitizer: DomSanitizer,
    private cache: CacheService,
    private platform: Platform,
    private push: PushService,
    private navCtrl: NavController,
    private configService: ConfigService,
    private app: AppComponent,
    private alertService: AlertService,
    private translate: TranslateService
  ) {
    super();
  }

  async ngOnInit() {
    this.sessions = await this.storage.get("sessions");
  }

  getHexColor(session: ISession) {
    return this.sanitizer.bypassSecurityTrustStyle(
      "color: " + session.hexColor
    );
  }

  /**
   * performLogout
   *
   * unsets current session, thus logging the user out
   */
  performLogout() {
    const newSessionObject: ISession[] = [];

    if (this.sessions) {
      for (const session of this.sessions) {
        if (session["isChecked"]) {
          if (this.platform.is("cordova")) {
            const config: IModuleConfig = this.configService.getConfigById(
              session.courseID
            );
            this.push.unsubscribeToPush(config);
          }
        } else {
          newSessionObject.push(session);
        }
      }

      this.cache.clearAll();
      if (newSessionObject.length > 0) {
        newSessionObject.sort((a: ISession, b: ISession) => {
          const aName = a.courseName + " " + a.courseFac;
          const bName = b.courseName + " " + b.courseFac;

          if (aName.toLowerCase() < bName.toLowerCase()) {
            return -1;
          }
          if (aName.toLowerCase() > bName.toLowerCase()) {
            return 1;
          }
          return 0;
        });
        this.storage.set("sessions", newSessionObject).finally(() => {
          this.app.initializeSession();
          this.app.initializeMenu();
          this.navCtrl.navigateRoot("/home");
        });
      } else {
        this.storage.remove("sessions").finally(() => {
          this.app.initializeSession();
          this.app.initializeMenu();
          this.navCtrl.navigateRoot("/select-module");
        });
      }
    }
  }

  hideCourses() {
    if (this.sessions) {
      let hiddenCount = 0;
      for (const session of this.sessions) {
        if (session["isChecked"]) {
          session.isHidden = !session.isHidden;
          session["isChecked"] = false;
        }

        if (session.isHidden) {
          hiddenCount++;
        }
      }

      if (hiddenCount === this.sessions.length) {
        this.sessions[0].isHidden = false;

        this.alertService.showAlert(
          {
            headerI18nKey: "statusMessage.login.hint",
            messageI18nKey: "label.logoutPage.cantHideEverything",
          },
          [{ text: this.translate.instant("buttonLabel.ok") }]
        );
      }

      this.storage.set("sessions", this.sessions).finally(() => {
        this.app.initializeSession();
        this.app.initializeMenu();
      });
    }
  }

  isModuleSelected() {
    let moduleSelected = false;

    if (this.sessions) {
      for (const session of this.sessions) {
        if (session["isChecked"]) {
          moduleSelected = true;
          break;
        }
      }
    }

    return !moduleSelected;
  }

  async goBack() {
    const previousPage = await this.storage.get("visibilityPreviousPage");
    this.storage.remove("visibilityPreviousPage");

    if (previousPage && previousPage !== "/home") {
      this.navCtrl.navigateRoot("/home").then(() => {
        this.navCtrl.navigateForward(previousPage);
      });
    } else {
      this.navCtrl.navigateRoot("/home");
    }
  }
}
