import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { PhotoViewer } from '@ionic-native/photo-viewer';
import { File } from '@ionic-native/file';
import { IModuleConfig, IMintObject } from '../../lib/interfaces/config';
import { Storage } from '@ionic/storage';

@IonicPage()
@Component({
  selector: 'page-mint',
  templateUrl: 'mint.html',
})
export class MintPage {

  mintDetails:IMintObject[] = []; 
  configLoaded = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, private storage:Storage, private file: File, private photoView: PhotoViewer, private iap: InAppBrowser, private platform: Platform) {
  }

  ngOnInit() {
    this.storage.get("config").then((config:IModuleConfig) => {
      this.mintDetails = this.convertToArray(config.mintDetails);
      this.configLoaded = true;
    }); 
  }

  convertToArray(toConvert) { // convert everything to an array so you can handle it universally 
    if (Array.isArray(toConvert)) {
      return toConvert;
    } else {
      var tmp = [];
      tmp.push(toConvert);
      return tmp;
    }
  }

  showOpeningHours(imagePath:string) {
    let url = "https://www.uni-potsdam.de/fileadmin01/projects/mnfakul/Dokumente_und_Übersichten/Studium_und_Lehre/Fächer_und_Tutoren_WiSe_18_19.pdf";

    if (this.platform.is("cordova")) {
      let options = {
        share: true,
        closeButton: true, 
        copyToReference: true
      };

      this.photoView.show(this.file.applicationDirectory + "www/" + imagePath, "MINT-Raumzeiten und Fächer", options);
    } else {
      this.openWithInAppBrowser(url);
    }
  }

  openWithInAppBrowser(url:string) {
    let target = "_blank";
    this.iap.create(url,target);
  }

}
