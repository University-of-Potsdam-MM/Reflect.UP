import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  constructor(
    private storage: Storage,
    private navCtrl: NavController
  ) {}

  async ngOnInit() {
    const sessions = await this.storage.get('sessions');
    if (!sessions) {
      this.navCtrl.navigateRoot('/select-module');
    } else { console.log(sessions); }
  }
}
