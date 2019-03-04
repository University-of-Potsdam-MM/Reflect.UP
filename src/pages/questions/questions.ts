import { FeedbackObject, QuestionConfig } from '../../lib/interfaces/question';
import { QuestionProvider } from '../../providers/question-provider/question-provider';
import { TranslateService } from '@ngx-translate/core';
import { ConnectionProvider } from '../../providers/connection-provider/connection-provider';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { IModuleConfig } from '../../lib/interfaces/config';

@IonicPage()
@Component({
  selector: 'page-questions',
  templateUrl: 'questions.html',
})
export class QuestionsPage {

  public isLoaded = false;
  public questionList: FeedbackObject[];
  public completedQuestionList: FeedbackObject[] = [];
  private noQuestions = false;
  private noCompletedQuestions = true;
  private showCompletedQuestions = false;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public connection: ConnectionProvider,
              public translate: TranslateService,
              public alertCtrl: AlertController,
              public questions: QuestionProvider,
              private storage: Storage)
  { }

  ngOnInit() {
    var forceReload;
    if (this.navParams.get("forceReload")) {
      forceReload = true;
    } else { forceReload = false; }
    this.initQuestions(forceReload);
  }

  initQuestions(forceReload, refresher?) {
    this.storage.get("config").then((config:IModuleConfig) => {
      this.storage.get("session").then(session => {
        this.loadQuestions(config, session.token, forceReload, refresher);
      });
    });
  }

  loadQuestions(config:IModuleConfig, token, forceReload, refresher?) {
    this.connection.checkOnline().subscribe(online => {
      if (online || !forceReload) {
        if (!refresher) { this.isLoaded = false; }

        this.questions.getQuestions(config, token, forceReload).subscribe((questionJson:QuestionConfig) => {
          if (questionJson.feedbacks) {
            this.questionList = questionJson.feedbacks;

            if (this.questionList.length > 0) {
              this.noQuestions = true;
            }
          } else {
            this.noQuestions = true;
            console.log("error fetching feedbacks from server.");
          }
        });

        this.questions.getAnsweredQuestions(config, token, forceReload).subscribe((questionJson:QuestionConfig) => {
          if (questionJson.feedbacks) {
            this.completedQuestionList = questionJson.feedbacks;

            if (this.completedQuestionList.length > 0) {
              this.noCompletedQuestions = false;
            }
          } else {
            this.noCompletedQuestions = true;
            console.log("error fetching completed feedbacks from server.");
          }

          this.isLoaded = true;
          if (refresher) { this.doRefresh(refresher, true); }
        });
      } else {
        // there is no network connection
        this.showAlert("statusMessage.error.network");
      }
    });
  }

  showAlert(alertTextKey:string): void {
    let alert = this.alertCtrl.create({
      title: this.translate.instant("statusMessage.error.title"),
      subTitle: this.translate.instant(alertTextKey),
      buttons: [
        this.translate.instant("buttonLabel.ok")
      ]
    });
    alert.present();
  }

  toggleCompleted() {
    this.showCompletedQuestions = !this.showCompletedQuestions;
  }

  doRefresh(refresher, refreshingComplete?) {
    if (refreshingComplete) {
      refresher.complete();
    } else {
      this.initQuestions(true, refresher);
    }
  }

}
