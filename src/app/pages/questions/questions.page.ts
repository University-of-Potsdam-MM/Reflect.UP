import { Component, OnInit } from '@angular/core';
import { QuestionConfig } from 'src/app/lib/question';
import { NavController, AlertController } from '@ionic/angular';
import { ConnectionService } from 'src/app/services/connection/connection.service';
import { TranslateService } from '@ngx-translate/core';
import { QuestionService } from 'src/app/services/question/question.service';
import { Storage } from '@ionic/storage';
import { IModuleConfig } from 'src/app/lib/config';
import { ISession } from 'src/app/services/login-provider/interfaces';
import { ConfigService } from 'src/app/services/config/config.service';
import * as dLoop from 'delayed-loop';

@Component({
  selector: 'app-questions',
  templateUrl: './questions.page.html',
  styleUrls: ['./questions.page.scss'],
})
export class QuestionsPage implements OnInit {

  sessions: ISession[];

  public isLoaded = false;
  public questionList = [];
  public completedQuestionList = [];
  public noQuestions = [];
  public noCompletedQuestions = [];
  public showCompletedQuestions = [];
  moduleExpanded = [];

  constructor(
    public navCtrl: NavController,
    public connection: ConnectionService,
    public translate: TranslateService,
    public alertCtrl: AlertController,
    public questions: QuestionService,
    private storage: Storage,
    private configService: ConfigService
  ) { }

  async ngOnInit() {
    this.sessions = await this.storage.get('sessions');
    this.initQuestions(true);
  }

  initQuestions(forceReload, refresher?) {
    this.connection.checkOnline().subscribe(online => {
      if (online || !forceReload) {
        if (!refresher) { this.isLoaded = false; }

        const outerLoop = dLoop([0, 1], (itm, idx, finAll) => {
          if (idx === 0) {
            // load questions that haven't been answered yet
            const loop = dLoop(this.sessions, (session, sessionIdx, fin) => {
              this.questionList[sessionIdx] = [];
              this.noQuestions[sessionIdx] = false;
              const config: IModuleConfig = this.configService.getConfigById(session.courseID);
              this.loadQuestions(config, session.token, forceReload, sessionIdx, fin);
            });

            loop.then(() => {
              finAll();
            });
          } else {
            // load completed questions
            const loop = dLoop(this.sessions, (session, sessionIdx, fin) => {
              this.completedQuestionList[sessionIdx] = [];
              this.noCompletedQuestions[sessionIdx] = false;
              const config: IModuleConfig = this.configService.getConfigById(session.courseID);
              this.loadAnsweredQuestions(config, session.token, forceReload, sessionIdx, fin);
            });

            loop.then(() => {
              finAll();
            });
          }
        });

        outerLoop.then(() => {
          if (refresher) { refresher.target.complete(); }
          this.isLoaded = true;
        });
      } else {
        // there is no network connection
        this.showAlert('statusMessage.error.network');
      }
    });
  }

  loadQuestions(config: IModuleConfig, token: string, forceReload, idx, fin) {
    this.questions.getQuestions(config, token, forceReload).subscribe((questionJson: QuestionConfig) => {
      if (questionJson.feedbacks) {
        this.questionList[idx] = questionJson.feedbacks;
        if (this.questionList[idx].length < 1) { this.noQuestions[idx] = true; }
      } else {
        this.noQuestions[idx] = true;
        console.log('no feedbacks from server.');
      }

      fin();
    }, error => {
      console.log(error);
      this.noQuestions[idx] = true;
      fin();
    });
  }

  loadAnsweredQuestions(config: IModuleConfig, token: string, forceReload, idx, fin) {
    this.questions.getAnsweredQuestions(config, token, forceReload).subscribe((questionJson: QuestionConfig) => {
      if (questionJson.feedbacks) {
        this.completedQuestionList[idx] = questionJson.feedbacks;
        if (this.completedQuestionList[idx].length < 1) { this.noCompletedQuestions[idx] = true; }
      } else {
        this.noCompletedQuestions[idx] = true;
        console.log('no completed feedbacks from server.');
      }

      fin();
    }, error => {
      console.log(error);
      this.noCompletedQuestions[idx] = true;
      fin();
    });
  }

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