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
  moduleExpanded = [];

  constructor(
    private configService: ConfigService,
    private storage: Storage
  ) { }

  async ngOnInit() {
    const sessions: ISession[] = await this.storage.get('sessions');
    for (let i = 0; i < sessions.length; i++) {
      if (!sessions[i].isHidden) {
        this.selectedModules.push(this.configService.getConfigById(sessions[i].courseID));
      }
    }
  }

}
