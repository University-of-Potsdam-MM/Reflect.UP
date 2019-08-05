import { Storage } from '@ionic/storage';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { PushMessage } from '../../lib/interfaces';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { ISession } from '../../providers/login-provider/interfaces';
import * as moment from 'moment';
import { IModuleConfig } from '../../lib/interfaces/config';

interface MessagesResponse {
  messages: PushMessage[];
}

@IonicPage()
@Component({
  selector: 'page-push-messages',
  templateUrl: 'push-messages.html',
})
export class PushMessagesPage {

  pushMessages: PushMessage[];
  responseError = false;
  isLoaded = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public storage: Storage,
    private http: HttpClient) {
  }

  ionViewWillEnter() {
    this.getPushMessages();
  }

  async getPushMessages(refresher?) {
    const session: ISession = await this.storage.get("session");
    const config: IModuleConfig = await this.storage.get("config");

    this.responseError = false;

    if (!refresher) { this.isLoaded = false; }

    const params: HttpParams = new HttpParams()
      .append("wstoken", session.token)
      //.append("wstoken", "879992a39c5392775ed8f0967de59878")
      .append("wsfunction", "local_reflect_get_messages")
      .append("moodlewsrestformat", "json")
      .append("courseID", config.courseID);

    const headers: HttpHeaders = new HttpHeaders()
      .append("Authorization", config.authorization.credentials.authHeader.accessToken);

    const endpoint = config.moodleServiceEndpoint;
    //const endpoint = "http://localhost:8888/moodle37/webservice/rest/server.php";

    this.http.get(endpoint, { headers: headers, params: params }).subscribe((response: MessagesResponse) => {
      if (response.messages) {

        for (let i = 0; i < response.messages.length; i++) {
          response.messages[i].timestamp = moment.unix(response.messages[i].timestamp).format('LLL');
          if (response.messages[i].title === '') {
            response.messages[i].title = "Reflect.UP";
          }
        }

        this.pushMessages = response.messages;
      } else {
        this.responseError = true;
        console.log('ERROR while getting messages');
        console.log(JSON.stringify(response));
      }

      if (refresher) { refresher.complete(); }
      this.isLoaded = true;
    }, error => {
      this.responseError = true;
      console.log('ERROR while getting messages');
      console.log(JSON.stringify(error));
      if (refresher) { refresher.complete(); }
      this.isLoaded = true;
    });
  }

  doRefresh(refresher) {
    this.getPushMessages(refresher);
  }

}