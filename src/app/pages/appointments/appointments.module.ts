import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Routes, RouterModule } from "@angular/router";

import { IonicModule } from "@ionic/angular";

import { AppointmentsPage } from "./appointments.page";
import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { HttpLoaderFactory } from "src/app/lib/interfaces";
import { HttpClient } from "@angular/common/http";
import { ComponentsModule } from "src/app/components/components.module";
import { CalendarModule } from "ion2-calendar";

const routes: Routes = [
  {
    path: "",
    component: AppointmentsPage,
  },
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    CalendarModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
    RouterModule.forChild(routes),
  ],
  declarations: [AppointmentsPage],
})
export class AppointmentsPageModule {}
