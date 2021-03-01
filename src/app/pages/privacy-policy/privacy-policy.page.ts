import { Component } from "@angular/core";
import { AbstractPage } from "../abstract-page";

@Component({
  selector: "app-privacy-policy",
  templateUrl: "./privacy-policy.page.html",
  styleUrls: ["./privacy-policy.page.scss"],
})
export class PrivacyPolicyPage extends AbstractPage {
  constructor() {
    super();
  }
}
