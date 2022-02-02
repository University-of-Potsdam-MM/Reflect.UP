import { Component, OnInit } from "@angular/core";
import { IModuleConfig } from "src/app/lib/config";
import { ConfigService } from "src/app/services/config/config.service";
import { Storage } from "@ionic/storage-angular";
import { ISession } from "src/app/services/login-provider/interfaces";
import { AbstractPage } from "../abstract-page";

@Component({
  selector: "app-contacts",
  templateUrl: "./contacts.page.html",
  styleUrls: ["./contacts.page.scss"],
})
export class ContactsPage extends AbstractPage implements OnInit {
  selectedModules: IModuleConfig[] = [];
  moduleExpanded = [];
  isLoaded = false;

  constructor(private configService: ConfigService, private storage: Storage) {
    super();
  }

  ngOnInit() {
    this.getContactDetails();
  }

  async getContactDetails(refresher?) {
    this.isLoaded = false;
    const sessions: ISession[] = await this.storage.get("sessions");
    this.selectedModules = [];
    this.moduleExpanded = [];
    for (let i = 0; i < sessions.length; i++) {
      if (!sessions[i].isHidden) {
        this.selectedModules.push(
          this.configService.getConfigById(sessions[i].courseID)
        );
      }
    }

    if (refresher && refresher.target) {
      refresher.target.complete();
    }
    this.isLoaded = true;
  }
}
