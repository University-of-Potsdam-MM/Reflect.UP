import { HomePage } from './../../pages/home/home';
import { InfoPage } from './../../pages/info/info';
import { ImpressumPage } from './../../pages/impressum/impressum';
import { NavController } from 'ionic-angular';
import { Component } from '@angular/core';

@Component({
  selector: 'tab-bar',
  templateUrl: 'tab-bar.html'
})
export class TabBarComponent {

  constructor(private navCtrl: NavController) {
  }

  openPage(pageID) {
    switch(pageID) {
      case 0: {
        if (this.navCtrl.getActive().component != HomePage) {
          this.navCtrl.setRoot(HomePage, {fromSideMenu: true});
        }
        break;
      }
      case 1: {
        this.navCtrl.push(InfoPage);
        break;
      }
      case 2: {
        this.navCtrl.push(ImpressumPage);
        break;
      }
    }
  }

}
