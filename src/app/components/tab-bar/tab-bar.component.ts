import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-tab-bar',
  templateUrl: './tab-bar.component.html',
  styleUrls: ['./tab-bar.component.scss'],
})
export class TabBarComponent implements OnInit {

  constructor(
    private router: Router,
    private navCtrl: NavController
  ) { }

  ngOnInit() {}

  openPage(pageID) {
    switch (pageID) {
      case 0: {
        if (this.router.url === '/home') {
          this.navCtrl.navigateRoot('/home');
        }
        break;
      }
      case 1: {
        this.navCtrl.navigateForward('/info');
        break;
      }
      case 2: {
        this.navCtrl.navigateForward('/impressum');
        break;
      }
    }
  }

}
