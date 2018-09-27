import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { HttpHeaders, HttpParams, HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { ConnectionProvider } from '../../providers/connection-provider/connection-provider';
import { TranslateService } from '@ngx-translate/core';
import { WebHttpUrlEncodingCodec } from "../../lib/interfaces";
import { IModuleConfig } from '../../lib/interfaces/config';
import { IFeedbackResponse } from './../../lib/interfaces';
import { ISession } from "../../providers/login-provider/interfaces";

@IonicPage()
@Component({
  selector: 'page-feedback',
  templateUrl: 'feedback.html',
})
export class FeedbackPage {

  // used for template switching
  submitted:boolean = false;

  constructor(
      public navCtrl: NavController,
      public navParams: NavParams,
      public storage: Storage,
      public http: HttpClient,
      public connection: ConnectionProvider,
      public alertCtrl: AlertController,
      public translate: TranslateService
  ) { }

  /**
   * asyncSendFeedback
   *
   * sends feedbackText to webservice if text is not empty
   */
  public async asyncSendFeedback(feedbackText:string) {
    if (feedbackText) {

      let config:IModuleConfig = await this.storage.get("config");
      let session:ISession = await this.storage.get("session");

      let httpHeaders = new HttpHeaders()
        .append("Authorization",      config.authorization.credentials.authHeader.accessToken);

      let httpParams = new HttpParams({encoder: new WebHttpUrlEncodingCodec})
        .append("wstoken",            session.token)
        .append("wsfunction",         "local_reflect_post_feedback")
        .append("moodlewsrestformat", config.authorization.credentials.moodlewsrestformat)
        .append("feedback",           feedbackText)
        .append("courseID",           config.courseID);

      this.connection.checkOnline().subscribe(online => {
        if (online) {

          // need to use proxy defined in ionic.config.json
          let feedback_url = config.moodleServiceEndpoint;

          this.http.get<IFeedbackResponse>(
            feedback_url,
            {
              params:httpParams,
              headers: httpHeaders
            }
          ).subscribe(
            response => {
              if (response.result) {
                // success, set submitted to true to switch templates
                this.submitted = true;
                console.log("feedback submitted");
              } else {
                // probably authentication error
                this.showAlert("statusMessage.error.unknown");
                // user does not need to see the message
                console.log(response);
              }
            },
            error => {
              // httpError
              this.showAlert("statusMessage.error.http" + error.status);
              console.log(error);
            }
          )
        } else {
          // no internet connection
          this.showAlert("statusMessage.error.network");
        }
      })
    } else {
      // no input
      this.showAlert("statusMessage.login.noInput");
    }
  }

  /**
   * goHome
   *
   * sends the user to the HomePage (defaults to HomePage), back to where he belongs
   */
  public goHome() {
    this.navCtrl.popToRoot();
  }

  /**
   * showAlert
   *
   * shows alert with given text and translates the text
   *
   * => this method appears in multiple pages, should be outsourced and
   *    generalized!
   */
  private showAlert(alertTextKey:string): void {
    let alert = this.alertCtrl.create({
      title: this.translate.instant("statusMessage.error.title"),
      subTitle: this.translate.instant(alertTextKey),
      buttons: [
        this.translate.instant("buttonLabel.ok")
      ]
    });
    alert.present();
  }

  @ViewChild('myInput') myInput: ElementRef;
  resize() {
      let element = this.myInput['_elementRef'].nativeElement.getElementsByClassName("text-input")[0];
      element.style.overflow = 'hidden';
      element.style.height = 'auto';
      element.style.height = element.scrollHeight + 'px';
      this.myInput['_elementRef'].nativeElement.style.height = (element.scrollHeight + 16) + 'px';
  }

}
