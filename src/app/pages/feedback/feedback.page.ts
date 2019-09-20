import { Component, OnInit } from '@angular/core';
import { NavController, AlertController } from '@ionic/angular';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { ConnectionService } from 'src/app/services/connection/connection.service';
import { TranslateService } from '@ngx-translate/core';
import { IFeedbackResponse, WebHttpUrlEncodingCodec } from 'src/app/lib/interfaces';
import { ISession } from 'src/app/services/login-provider/interfaces';
import { IModuleConfig } from 'src/app/lib/config';
import { ConfigService } from 'src/app/services/config/config.service';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.page.html',
  styleUrls: ['./feedback.page.scss'],
})
export class FeedbackPage implements OnInit {

  sessions: ISession[];
  selectedSession: ISession;

  constructor(
    public navCtrl: NavController,
    public storage: Storage,
    public http: HttpClient,
    public connection: ConnectionService,
    public alertCtrl: AlertController,
    public translate: TranslateService,
    private configService: ConfigService
  ) { }

  submitted = false;

  async ngOnInit() {
    this.sessions = await this.storage.get('sessions');
  }

  setSelectedModule($event) {
    this.selectedSession = $event.detail.value;
  }

  /**
   * asyncSendFeedback
   *
   * sends feedbackText to webservice if text is not empty
   */
  public async asyncSendFeedback(feedbackText: string) {
    if (feedbackText) {

      const config: IModuleConfig = this.configService.getConfigById(this.selectedSession.courseID);

      const httpHeaders = new HttpHeaders()
        .append('Authorization',      config.authorization.credentials.authHeader.accessToken);

      const httpParams = new HttpParams({encoder: new WebHttpUrlEncodingCodec})
        .append('wstoken',            this.selectedSession.token)
        .append('wsfunction',         'local_reflect_post_feedback')
        .append('moodlewsrestformat', config.authorization.credentials.moodlewsrestformat)
        .append('feedback',           feedbackText)
        .append('courseID',           config.courseID);

      this.connection.checkOnline().subscribe(online => {
        if (online) {

          // need to use proxy defined in ionic.config.json
          const feedback_url = config.moodleServiceEndpoint;

          this.http.get<IFeedbackResponse>(
            feedback_url,
            {
              params: httpParams,
              headers: httpHeaders
            }
          ).subscribe(
            response => {
              if (response.result) {
                // success, set submitted to true to switch templates
                this.submitted = true;
                console.log('feedback submitted');
              } else {
                // probably authentication error
                this.showAlert('statusMessage.error.unknown');
                // user does not need to see the message
                console.log(response);
              }
            },
            error => {
              // httpError
              this.showAlert('statusMessage.error.http' + error.status);
              console.log(error);
            }
          );
        } else {
          // no internet connection
          this.showAlert('statusMessage.error.network');
        }
      });
    } else {
      // no input
      this.showAlert('statusMessage.login.noInput');
    }
  }

  /**
   * goHome
   *
   * sends the user to the HomePage (defaults to HomePage), back to where he belongs
   */
  public goHome() {
    this.navCtrl.navigateRoot('/home');
  }

  /**
   * showAlert
   *
   * shows alert with given text and translates the text
   *
   * => this method appears in multiple pages, should be outsourced and
   *    generalized!
   */
  async showAlert(alertTextKey: string) {
    const alert = await this.alertCtrl.create({
      header: this.translate.instant('statusMessage.error.title'),
      subHeader: this.translate.instant(alertTextKey),
      buttons: [
        this.translate.instant('buttonLabel.ok')
      ]
    });
    await alert.present();
  }

}
