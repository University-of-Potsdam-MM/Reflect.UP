import { NgModule } from '@angular/core';
import { ContactComponent } from './contact/contact.component';
import { EventComponent } from './event/event.component';
import { QuestionComponent } from './question/question.component';
import { TabBarComponent } from './tab-bar/tab-bar.component';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

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
  export class ComponentsModule { }
