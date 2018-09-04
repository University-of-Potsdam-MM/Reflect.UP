import { FeedbackObject, QuestionConfig } from '../../lib/interfaces/question';
import { QuestionProvider } from '../../providers/question-provider/question-provider';
import { TranslateService } from '@ngx-translate/core';
import { ConnectionProvider } from '../../providers/connection-provider/connection-provider';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';

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
              public questions: QuestionProvider)
  {
    this.isLoaded = false;
  }

  public ngOnInit() {

    this.connection.checkOnline().subscribe(online => {
      if (online) {
        this.isLoaded = false;
        this.questions.loadParams();

        this.questions.readyObservable.subscribe(
          ready => {
            if (ready) {
              this.questions.getQuestions().subscribe((questionJson:QuestionConfig) => {
                if (questionJson.feedbacks) {
                  this.questionList = questionJson.feedbacks;

                  if (this.questionList.length < 1) {
                    this.noQuestions = true;
                  }
                } else {
                  this.noQuestions = true;
                  console.log("error fetching feedbacks from server.");
                }

              })

              this.questions.getAnsweredQuestions().subscribe((questionJson:QuestionConfig) => {
                if (questionJson.feedbacks) {
                  for (let feedback of questionJson.feedbacks) {
                    if (feedback.answers.length > 0) {
                      this.completedQuestionList.push(feedback);
                    }
                  }
  
                  if (this.completedQuestionList.length > 0) {
                    this.noCompletedQuestions = false;
                  }
                } else {
                  console.log("error fetching completed feedbacks from server.");
                }

                this.isLoaded = true;
              })

            }
          }
        )
      } else {
        // there is no network connection
        this.showAlert("statusMessage.error.network");
      }
    })
  }

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

  toggleCompleted() {
    this.showCompletedQuestions = !this.showCompletedQuestions;
  }

}
