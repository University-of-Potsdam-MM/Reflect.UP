import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
})
export class ContactComponent implements OnInit {

  @Input() item;
  shortenedUrl;

  constructor() { }

  ngOnInit() {
    if (this.item.consultation_url) {
      this.shortenedUrl = this.item.consultation_url.substring(0, 30) + '...';
    }
  }

}
