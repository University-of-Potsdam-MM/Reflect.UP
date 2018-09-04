import { SelectModulePage } from './../select-module/select-module';
import { Component } from '@angular/core';
import { IonicPage, ViewController, NavParams, App } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-popover',
  templateUrl: 'popover.html',
})
export class PopoverPage {

  moduleConfigList: any[] = [];
  moduleSemester: string[] = [];

  constructor(public viewCtrl: ViewController, public navParams: NavParams, private appCtrl: App) {
    this.moduleConfigList = navParams.data;
    var i;
    this.moduleSemester = [];
    for (i = 0; i < this.moduleConfigList.length; i++) {
      var semesterFound = false;
      let editedTerm = this.moduleConfigList[i].courseID.slice(4,6).concat('/').concat(this.moduleConfigList[i].courseID.slice(6,8));
      var j;
      for (j = 0; j < this.moduleSemester.length; j++) {
        if (this.moduleSemester[j] == editedTerm) {
          semesterFound = true;
        }
      }
      if (!semesterFound) { this.moduleSemester.push(editedTerm); }
    }
  }

  close(searchTerm:string) {
    this.viewCtrl.dismiss();
    this.appCtrl.getRootNavs()[0].setRoot(SelectModulePage, { searchTerm: searchTerm });
  }

  clear() {
    this.viewCtrl.dismiss();
    this.appCtrl.getRootNavs()[0].setRoot(SelectModulePage);
  }

}
