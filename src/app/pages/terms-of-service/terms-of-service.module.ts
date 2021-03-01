import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Routes, RouterModule } from "@angular/router";

import { IonicModule } from "@ionic/angular";

import { TermsOfServicePage } from "./terms-of-service.page";
import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { HttpLoaderFactory } from "src/app/lib/interfaces";
import { HttpClient } from "@angular/common/http";

const routes: Routes = [
  {
    path: "",
    component: TermsOfServicePage,
  },
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
    RouterModule.forChild(routes),
  ],
  declarations: [TermsOfServicePage],
})
export class TermsOfServicePageModule {}
