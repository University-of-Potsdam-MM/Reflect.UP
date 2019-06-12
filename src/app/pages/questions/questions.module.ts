import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { QuestionsPage } from './questions.page';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpLoaderFactory } from 'src/app/lib/interfaces';
import { HttpClient } from '@angular/common/http';

const routes: Routes = [
  {
    path: '',
    component: QuestionsPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: (HttpLoaderFactory),
        deps: [HttpClient]
      }
    }),
    RouterModule.forChild(routes)
  ],
  declarations: [QuestionsPage]
})
export class QuestionsPageModule {}
