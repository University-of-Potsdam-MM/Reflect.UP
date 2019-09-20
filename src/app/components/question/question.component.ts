import { Component, OnInit, Input } from '@angular/core';
import { FeedbackObject } from 'src/app/lib/question';
import { TranslateService } from '@ngx-translate/core';
import { ModalController } from '@ionic/angular';
import * as $ from 'jquery';
import * as _ from 'underscore';
import { QuestionDetailModalPage } from './question-detail.modal';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss'],
})
export class QuestionComponent implements OnInit {

  @Input() public questions: FeedbackObject;
  isCompleted = false;
  modalOpen = true;

  constructor(
    private translate: TranslateService,
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {
    if (this.questions.answers !== undefined) {
      this.isCompleted = true;
    }
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
          isCompleted: this.isCompleted
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
          isCompleted: this.isCompleted
        }
      });
      modal.present();
      this.modalOpen = true;
      await modal.onWillDismiss();
      this.modalOpen = false;
    }
  }

  processMoodleContents(stringToAnalize: string) {
    // checking for multi language tags

    try {
      const domObj = $($.parseHTML(stringToAnalize));
      let result = stringToAnalize;
      const language = this.translate.currentLang;

      if (domObj.length > 1) {

        _.each(domObj, function(element) {
          if ($(element)[0].lang === language) {
            result = $(element).html();
          }
        });

        // since there are some strings without spanish translation
        // use englisch as a fallback
        if (result === stringToAnalize) {
          _.each(domObj, function(element) {
            if ($(element)[0].lang === 'en') {
              result = $(element).html();
            }
          });
        }
      }
      return result;
    } catch (e) {
      console.log(e);
      return stringToAnalize;
    }
  }

}
