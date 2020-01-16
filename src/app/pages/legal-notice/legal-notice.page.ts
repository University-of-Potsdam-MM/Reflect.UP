import { Component, OnInit } from '@angular/core';
import { AbstractPage } from '../abstract-page';

@Component({
  selector: 'app-legal-notice',
  templateUrl: './legal-notice.page.html',
  styleUrls: ['./legal-notice.page.scss'],
})
export class LegalNoticePage extends AbstractPage implements OnInit {

  constructor() {
    super();
  }

  ngOnInit() {
  }

}
