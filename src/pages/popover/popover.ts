import { Component } from '@angular/core';
import { IonicPage, ViewController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-popover',
  templateUrl: 'popover.html',
})
export class PopoverPage {

  moduleConfigList: any[] = [];
  moduleSemester: string[] = [];
  activeSegment;

  constructor(public viewCtrl: ViewController, public navParams: NavParams) {
    this.moduleConfigList = navParams.data.modules;
    this.activeSegment = navParams.data.activeSegment;
    this.moduleSemester = [];
    for (let i = 0; i < this.moduleConfigList.length; i++) {
      var semesterFound = false;
      let editedTerm = this.moduleConfigList[i].faculty;
      for (let j = 0; j < this.moduleSemester.length; j++) {
        if (this.moduleSemester[j] == editedTerm) {
          semesterFound = true;
        }
      }
      if (!semesterFound) {
        if (this.moduleConfigList[i].type === this.activeSegment) {
          this.moduleSemester.push(editedTerm);
        }
      }
    }
  }

  close(searchTerm:string) {
    this.viewCtrl.dismiss({ searchTerm: searchTerm, activeSegment: this.activeSegment });
  }

  clear() {
    this.viewCtrl.dismiss({ searchTerm: '', activeSegment: this.activeSegment });
  }

}
