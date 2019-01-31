import { Component, Input } from '@angular/core';

@Component({
  selector: 'contact',
  templateUrl: 'contact.html'
})
export class ContactComponent {

  @Input() item;

  shortenedUrl;

  constructor() {
  }

  ngOnInit() {
    if (this.item.consultation_url) {
      this.shortenedUrl = this.item.consultation_url.substring(0, 30) + "...";
    }
  }

}
