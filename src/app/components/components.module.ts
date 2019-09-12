import { NgModule } from '@angular/core';
import { ContactComponent } from './contact/contact.component';
import { EventComponent } from './event/event.component';
import { QuestionComponent } from './question/question.component';
import { TabBarComponent } from './tab-bar/tab-bar.component';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpLoaderFactory } from '../lib/interfaces';
import { HttpClient } from '@angular/common/http';

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
      TranslateModule,
      TranslateModule.forChild({
        loader: {
          provide: TranslateLoader,
          useFactory: (HttpLoaderFactory),
          deps: [HttpClient]
        }
      }),
    ],
    exports: [
      EventComponent,
      ContactComponent,
      QuestionComponent,
      TabBarComponent
    ]
  })
  export class ComponentsModule { }
