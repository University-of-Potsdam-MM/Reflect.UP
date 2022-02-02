import { Component, OnInit } from "@angular/core";
import * as moment from "moment";
import { TranslateService } from "@ngx-translate/core";
import { Storage } from "@ionic/storage-angular";
import { AbstractPage } from "../abstract-page";

@Component({
  selector: "app-settings",
  templateUrl: "./settings.page.html",
  styleUrls: ["./settings.page.scss"],
})
export class SettingsPage extends AbstractPage implements OnInit {
  language;

  constructor(private translate: TranslateService, private storage: Storage) {
    super();
  }

  ngOnInit() {
    this.language = this.translate.currentLang;
  }

  onChange(event) {
    this.language = event.detail.value;
    this.translate.use(this.language);
    moment.locale(this.language);
    this.storage.set("appLanguage", this.language);
  }
}
