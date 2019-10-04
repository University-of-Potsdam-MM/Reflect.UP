import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-contact-persons',
  templateUrl: './contact-persons.component.html',
  styleUrls: ['./contact-persons.component.scss'],
})
export class ContactPersonsComponent implements OnInit {

  @Input() contactPersonsObject;

  isLevelShown = false;

  constructor() { }

  ngOnInit() { }

  shortenURL(url: string): string {
    return url.substring(0, 30) + '...';
  }

}
