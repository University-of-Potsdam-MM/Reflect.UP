import { Component, Input } from "@angular/core";

@Component({
  selector: "app-contact-persons",
  templateUrl: "./contact-persons.component.html",
  styleUrls: ["./contact-persons.component.scss"],
})
export class ContactPersonsComponent {
  @Input() contactPersonsObject;

  isLevelShown = false;

  shortenURL(url: string): string {
    return url.substring(0, 30) + "...";
  }
}
