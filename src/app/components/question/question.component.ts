import { Component, OnInit, Input } from '@angular/core';
import { FeedbackObject } from 'src/app/lib/question';
import { ModalController } from '@ionic/angular';
import { QuestionDetailModalPage } from './question-detail.modal';
import { ISession } from 'src/app/services/login-provider/interfaces';
import { utils } from 'src/app/lib/utils';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss'],
})
export class QuestionComponent implements OnInit {

  @Input() public questions: FeedbackObject;
  @Input() session: ISession;
  isCompleted = false;
  modalOpen = true;
  utils;

  constructor(
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {
    if (this.questions.answers !== undefined) {
      this.isCompleted = true;
    }

    this.utils = utils;
  }

  async goToDetailPage() {
    if (this.isCompleted) {
      const modal = await this.modalCtrl.create({
        backdropDismiss: false,
        component: QuestionDetailModalPage,
        componentProps: {
          feedbackID:         this.questions.id,
          tmpQuestionsList:  this.questions.questions,
          feedbackMessage:    this.questions.feedbackMessage,
          answerList:    this.questions.answers,
          isCompleted: this.isCompleted,
          session: this.session
        }
      });
      modal.present();
      this.modalOpen = true;
      await modal.onWillDismiss();
      this.modalOpen = false;
    } else {
      const modal = await this.modalCtrl.create({
        backdropDismiss: false,
        component: QuestionDetailModalPage,
        componentProps: {
          feedbackID:         this.questions.id,
          tmpQuestionsList:  this.questions.questions,
          feedbackMessage:    this.questions.feedbackMessage,
          isCompleted: this.isCompleted,
          session: this.session
        }
      });
      modal.present();
      this.modalOpen = true;
      await modal.onWillDismiss();
      this.modalOpen = false;
    }
  }

}
