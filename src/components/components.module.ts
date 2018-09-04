import { IonicModule } from 'ionic-angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactComponent } from './contact/contact';
import { EventComponent } from './event/event';
import { TranslateModule } from '@ngx-translate/core';
import { QuestionComponent } from './question/question';
import { TabBarComponent } from './tab-bar/tab-bar';

@NgModule({
  declarations: [
    EventComponent,
    ContactComponent,
    QuestionComponent,
    TabBarComponent
  ],
  imports: [
    IonicModule,
    CommonModule,
    TranslateModule
  ],
  exports: [
    EventComponent,
    ContactComponent,
    QuestionComponent,
    TabBarComponent
  ]
})
export class ComponentsModule {}
