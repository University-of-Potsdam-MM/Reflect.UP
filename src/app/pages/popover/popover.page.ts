import { Component, OnInit, Input } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { AbstractPage } from '../abstract-page';

@Component({
  selector: 'app-popover',
  templateUrl: './popover.page.html',
  styleUrls: ['./popover.page.scss'],
})
export class PopoverPage extends AbstractPage implements OnInit {

  @Input() moduleConfigList;
  moduleSemester: string[] = [];
  @Input() activeSegment;

  constructor(
    private popoverCtrl: PopoverController
  ) {
    super();
  }

  ngOnInit() {
    this.moduleSemester = [];
    for (let i = 0; i < this.moduleConfigList.length; i++) {
      let semesterFound = false;
      const editedTerm = this.moduleConfigList[i].faculty;

      for (let j = 0; j < this.moduleSemester.length; j++) {
        if (this.moduleSemester[j] === editedTerm) {
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

  close(searchTerm: string) {
    this.popoverCtrl.dismiss({ searchTerm: searchTerm, activeSegment: this.activeSegment });
  }

  clear() {
    this.popoverCtrl.dismiss({ searchTerm: '', activeSegment: this.activeSegment });
  }

}
