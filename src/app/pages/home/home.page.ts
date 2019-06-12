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
    const configIndeces = await this.storage.get('config');
    if (!configIndeces) {
      this.navCtrl.navigateRoot('/select-module');
    }
  }
}
