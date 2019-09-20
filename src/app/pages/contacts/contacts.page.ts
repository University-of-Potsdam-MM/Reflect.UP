import { Component, OnInit } from '@angular/core';
import { IModuleConfig } from 'src/app/lib/config';
import { ConfigService } from 'src/app/services/config/config.service';
import { Storage } from '@ionic/storage';
import { ISession } from 'src/app/services/login-provider/interfaces';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.page.html',
  styleUrls: ['./contacts.page.scss'],
})
export class ContactsPage implements OnInit {

  selectedModules: IModuleConfig[] = [];
  showLevel1 = null;
  showLevel2 = null;
  moduleExpanded = [];

  constructor(
    private configService: ConfigService,
    private storage: Storage
  ) { }

  async ngOnInit() {
    const sessions: ISession[] = await this.storage.get('sessions');
    for (let i = 0; i < sessions.length; i++) {
      this.selectedModules.push(this.configService.getConfigById(sessions[i].courseID));
    }
  }

  toggleLevel1(idx) {
    if (this.isLevel1Shown(idx)) {
      this.showLevel1 = null;
      this.showLevel2 = null;
    } else {
      this.showLevel1 = idx;
      this.showLevel2 = null;
    }
  }

  toggleLevel2(idx) {
    if (this.isLevel2Shown(idx)) {
      this.showLevel2 = null;
    } else {
      this.showLevel2 = idx;
    }
  }

  isLevel1Shown(idx) {
    return this.showLevel1 === idx;
  }

  isLevel2Shown(idx) {
    return this.showLevel2 === idx;
  }

}
