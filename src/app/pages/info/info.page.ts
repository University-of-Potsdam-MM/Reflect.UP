import { Component } from "@angular/core";
import { AbstractPage } from "../abstract-page";

@Component({
  selector: "app-info",
  templateUrl: "./info.page.html",
  styleUrls: ["./info.page.scss"],
})
export class InfoPage extends AbstractPage {
  constructor() {
    super();
  }
}
