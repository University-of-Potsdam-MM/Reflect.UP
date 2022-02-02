import { Component, OnInit } from "@angular/core";
import { PushMessage } from "src/app/lib/interfaces";
import { NavController } from "@ionic/angular";
import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";
import { Storage } from "@ionic/storage-angular";
import * as moment from "moment";
import { ISession } from "src/app/services/login-provider/interfaces";
import * as dLoop from "delayed-loop";
import { ConfigService } from "src/app/services/config/config.service";
import { AbstractPage } from "../abstract-page";

interface MessagesResponse {
  messages: PushMessage[];
}

@Component({
  selector: "app-push-messages",
  templateUrl: "./push-messages.page.html",
  styleUrls: ["./push-messages.page.scss"],
})
export class PushMessagesPage extends AbstractPage implements OnInit {
  pushMessages = [];
  responseError = [];
  isLoaded = false;
  sessions: ISession[];
  moduleExpanded = [];

  constructor(
    public navCtrl: NavController,
    public storage: Storage,
    private http: HttpClient,
    private configService: ConfigService
  ) {
    super();
  }

  async ngOnInit() {
    this.sessions = await this.storage.get("sessions");
    this.loadPushMessages();
  }

  loadPushMessages(refresher?) {
    if (!refresher) {
      this.isLoaded = false;
    }

    const loop = dLoop(this.sessions, (itm, idx, fin) => {
      this.pushMessages[idx] = [];
      this.getPushMessages(
        itm,
        this.configService.getConfigById(itm.courseID),
        idx,
        fin
      );
    });

    loop.then(() => {
      if (refresher) {
        refresher.target.complete();
      }
      this.isLoaded = true;
    });
  }

  async getPushMessages(session, config, idx, fin) {
    this.responseError[idx] = false;

    const params: HttpParams = new HttpParams()
      .append("wstoken", session.token)
      .append("wsfunction", "local_reflect_get_messages")
      .append("moodlewsrestformat", "json")
      .append("courseID", config.courseID);

    const headers: HttpHeaders = new HttpHeaders().append(
      "Authorization",
      config.authorization.credentials.authHeader.accessToken
    );

    const endpoint = config.moodleServiceEndpoint;

    this.http.get(endpoint, { headers: headers, params: params }).subscribe(
      (response: MessagesResponse) => {
        if (response.messages) {
          this.logger.debug(
            "getPushMessages()",
            "received push messages",
            response
          );

          for (let i = 0; i < response.messages.length; i++) {
            response.messages[i].timestamp = moment
              .unix(response.messages[i].timestamp)
              .format("LLL");
            if (response.messages[i].title === "") {
              response.messages[i].title = "Reflect.UP";
            }
          }

          if (Array.isArray(response.messages)) {
            this.pushMessages[idx] = response.messages.reverse();
          } else {
            this.pushMessages[idx] = response.messages;
          }

          fin();
        } else {
          this.responseError[idx] = true;
          this.logger.debug(
            "getPushMessages()",
            "no messages received",
            response
          );
          fin();
        }
      },
      (error) => {
        this.responseError[idx] = true;
        this.logger.error(
          "getPushMessages()",
          "error while getting messages",
          error
        );
        fin();
      }
    );
  }

  doRefresh(refresher) {
    this.loadPushMessages(refresher);
  }
}
