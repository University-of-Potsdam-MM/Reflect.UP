import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PushMessagesPage } from './push-messages';

@NgModule({
  declarations: [
    // PushMessagesPage,
  ],
  imports: [
    IonicPageModule.forChild(PushMessagesPage),
  ],
})
export class PushMessagesPageModule {}
