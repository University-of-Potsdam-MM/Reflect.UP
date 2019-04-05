import { FeedbackObject } from '../../lib/interfaces/question';
import { NavController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { Component, Input } from '@angular/core';
import * as $ from 'jquery';
import * as _ from 'underscore';
import { QuestionDetailPage } from '../../pages/question-detail/question-detail';

@Component({
  selector: 'question',
  templateUrl: 'question.html'
})
export class QuestionComponent {

  @Input() public questions: FeedbackObject;
  isCompleted = false;

  constructor(private translate: TranslateService, private navCtrl: NavController) {
  }

  ngOnInit() {
    if (this.questions.answers != undefined) {
      this.isCompleted = true;
    }
  }

  goToDetailPage() {
    if (this.isCompleted) {
      this.navCtrl.push(QuestionDetailPage, {
        'id':         this.questions.id,
        'questions':  this.questions.questions,
        'message':    this.questions.feedbackMessage,
        'answers':    this.questions.answers,
        'isCompleted': this.isCompleted,
      });
    } else {
      this.navCtrl.push(QuestionDetailPage, {
        'id':         this.questions.id,
        'questions':  this.questions.questions,
        'message':    this.questions.feedbackMessage,
        'isCompleted': this.isCompleted,
      });
    }
  }

  processMoodleContents(stringToAnalize:string) {
    //checking for multi language tags

    try {
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

    catch(e) {
      console.log(e);
      return stringToAnalize;
    }
  }

}
