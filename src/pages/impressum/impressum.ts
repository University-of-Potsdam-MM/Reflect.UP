import { Storage } from '@ionic/storage';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { IModuleConfig } from '../../lib/interfaces/config';
import * as $ from 'jquery';
import * as _ from 'underscore';
import { TranslateService } from '@ngx-translate/core';

@IonicPage()
@Component({
  selector: 'page-impressum',
  templateUrl: 'impressum.html',
})
export class ImpressumPage {

  configStorageKey = "config";
  impressum = "\n\n            <em style=\"font-family: Helvetica, Arial, sans-serif;font-size: 1em;font-weight:normal; text-align:left;\">Herausgeber</em>\n            <p>\n            Universität Potsdam<br />\n            Am Neuen Palais 10<br />\n            14469 Potsdam<br /><br />\n            <b>Tel.:</b> 0331 977-0<br />\n            <b>Fax:</b> 0331 97 21 63<br />\n            <b>Web:</b> www.uni-potsdam.de<br />\n            </p>\n\n            <em>Verantwortlich für den App Store Account des Service Mobile.UP der Universität Potsdam</em>\n            <p>\n            Ulrike Lucke, CIO der Universität Potsdam<br />\n            14469 Potsdam<br />\n            <b>E-Mail:</b> <a href=\"mailto:mobileup-service@uni-potsdam.de\">mobileup-service@uni-potsdam.de</a>\n            </p>\n\n            <em>Rechtsform und gesetzliche Vertretung</em>\n            <p>\n            Die Universität Potsdam ist eine Körperschaft des Öffentlichen Rechts. Sie wird gesetzlich vertreten durch Prof. Oliver Günther, Ph.D., Präsident der Universität Potsdam, Am Neuen Palais 10, 14469 Potsdam.\n            </p>\n\n            <em>Zuständige Aufsichtsbehörde</em>\n            <p>Ministerium für Wissenschaft, Forschung und Kultur des Landes Brandenburg, Dortustr. 36, 14467 Potsdam</p>\n\n            <em>Umsatzsteueridentifikationsnummer und inhaltliche Verantwortlichkeit</em>\n            <p>Umsatzsteuer-Identifikationsnummer gemäß §27 a Umsatzsteuergesetz: DE138408327</p>\n            <p>Die inhaltliche Verantwortlichkeit i. S. v. § 5 TMG und § 55 Abs. 2 RStV übernimmt der ASTA (Allgemeiner Studierendenausschuss) der Universität Potsdam.</p>\n\n            <em>Haftung</em>\n            <p>Für die Punkte Haftung, Urheberrecht und Datenschutz gilt die <a\n            href=\"(http://www.zeik.uni-potsdam.de/fileadmin/projects/zeik/assets/benutzerordnung_zeik.pdf\">Nutzungsordnung der ZEIK</a>. Die Haftung erfolgt ausschließlich für die Erstinstallation und weiteren Updates aus dem App Store oder anderen offiziellen Quellen. Applikationen Dritter können ein einigen Stellen in Reflect.UP verlinkt werden. Diese werden jedoch separat installiert und beinhalten eigene Nutzungsrichtlinien. Für die Inhalte solcher Apps zeichnet sich die Universität Potsdam nicht verantwortlich.<br /><br />Der Zugriff ist technisch abgesichert und die Daten werden nicht zwischengespeichert. Die Verwendung dieses Dienstes erfolgt durch den Nutzer freiwillig.</p>\n\n                </p>\n\n            <h1>Ansprechpartner</h1>\n            <p>\n            <b>Alexander Knoth</b><br /> Universität Potsdam<br /> Wirtschafts- und Sozialwissenschaftliche Fakultät<br /> August-Bebel-Str. 89<br /> 14482 Potsdam<br />\n            Haus 1 | 1.54<br />\n            <br /> <b>Telefon:</b> +49-331-977-3564 <br style=\"clear: left;\">\n\n            </p>\n            </div>\n\n            <div>\n            <h1>Mitmachen</h1>\n            <p>\n            Es gibt die Möglichkeit als studentische Mitarbeiter innerhalb von\n            Lehrprojekten, Aufträgen oder Anstellung an der App-Entwicklung im\n            Rahmen des eLiS-Projekts mitzuwirken.<br />Die App ist als Open\n            Source Projekt veröffentlicht.<br />\n            <br />Wenn Sie sich für eine Mitarbeit an der App interessieren,\n            können Sie gern das Entwicklerteam unter <a href=\"mailto:elis-dev@lists.cs.uni-potsdam.de\">elis-dev@lists.cs.uni-potsdam.de</a>\n            kontaktieren.\n            </p>\n            </div>";
  showTOS = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, public storage: Storage, public translate: TranslateService) {
  }

  ngOnInit() {
    this.storage.get(this.configStorageKey).then(
      (config:IModuleConfig) => {
        if (config) {
          this.impressum = config.impressumTemplate;
        }
      }
    );
  }

  processMoodleContents(stringToAnalize:string) {
    //checking for multi language tags
    var domObj = $($.parseHTML(stringToAnalize));
    var result = stringToAnalize;
    let language = this.translate.currentLang;

    if (domObj.length > 1) {

        _.each(domObj, function(element) {
          if ($(element)[0].lang == language) {
            result = $(element).html();
          }
        });

        // since there are some strings without spanish translation
        // use englisch as a fallback
        if (result == stringToAnalize) {
          _.each(domObj, function(element) {
            if ($(element)[0].lang == "en") {
              result = $(element).html();
            }
          });
        }
    }
    return result;
  }

  toggleTOS() {
    this.showTOS = !this.showTOS;
  }

}
