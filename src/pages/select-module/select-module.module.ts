import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SelectModulePage } from './select-module';

@NgModule({
  declarations: [
    // SelectModulePage,
  ],
  imports: [
    IonicPageModule.forChild(SelectModulePage),
  ],
  entryComponents: [
    SelectModulePage
  ]
})
export class SelectModulePageModule {}
