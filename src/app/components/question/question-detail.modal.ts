import { OnInit, Component, Input } from '@angular/core';
import { AnswerObject, QuestionsObject } from 'src/app/lib/question';
import { NavController, ModalController, Platform } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { QuestionService } from 'src/app/services/question/question.service';
import * as $ from 'jquery';
import * as _ from 'underscore';
import { ConfigService } from 'src/app/services/config/config.service';
import { ISession } from 'src/app/services/login-provider/interfaces';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { SafariViewController } from '@ionic-native/safari-view-controller/ngx';
import { utils } from 'src/app/lib/utils';
import { LoggingService, Logger } from 'ionic-logging-service';

@Component({
    selector: 'question-detail-modal-page',
    templateUrl: './question-detail.modal.html',
    styleUrls: ['./question-detail.modal.scss'],
})
export class QuestionDetailModalPage implements OnInit {

  @Input() feedbackID;
  @Input() tmpQuestionsList: QuestionsObject[];
  @Input() feedbackMessage;
  @Input() answerList: AnswerObject[];
  @Input() isCompleted;
  @Input() session: ISession;

  public answersSubmitted = false;
  public isFirstQuestion = true;
  public checkBoxValue: boolean[][] = [];
  public radioBtnValue: boolean[][] = [];
  public textBoxValue: string[] = [];
  public answerSelected: boolean[] = [];

  radioGroupValue: string[] = [];

  public questionList: QuestionsObject[] = [];
  public choicesList: string[][] = [];
  public isCheckbox: boolean[] = [];
  public isPageActive: boolean[] = [false];
  public previousPage: number[] = [];
  public latestPage = 0;
  public questionNavIndex = 1;

  utils;
  logger: Logger;

  constructor(
    public navCtrl: NavController,
    private translate: TranslateService,
    private questionProv: QuestionService,
    private configService: ConfigService,
    private modalCtrl: ModalController,
    private platform: Platform,
    private inAppBrowser: InAppBrowser,
    private safariOrChrome: SafariViewController,
    private loggingService: LoggingService
  ) { }

  ngOnInit() {
    this.utils = utils;
    this.logger = this.loggingService.getLogger('[/question-detail]');

    for (let i = 0; i < this.tmpQuestionsList.length; i++) {
      if (this.tmpQuestionsList[i].type === 'multichoice' || this.tmpQuestionsList[i].type === 'textarea') {
        this.questionList.push(this.tmpQuestionsList[i]);
      }
    }

    this.feedbackMessage = this.htmlDecode(this.feedbackMessage);
    this.isPageActive[0] = true;
    this.prepareChoices();
    this.initArrays();
    if (this.isCompleted) { this.prepareCompletedAnswers(); }
  }

  prepareCompletedAnswers() {
    let i, j, k;

    for (i = 0; i < this.questionList.length; i++) {
      for (j = 0; j < this.answerList.length; j++) {
        if (this.questionList[i].id === this.answerList[j].item) {
          if (this.questionList[i].type === 'textarea') {
            // fill in text value
            this.textBoxValue[i] = this.answerList[j].value;
          } else if (this.isCheckbox[i] && (this.questionList[i].type === 'multichoice')) {
            // fill checkboxes
            const answerArray = this.answerList[j].value.split('|');
            for (k = 0; k < answerArray.length; k++) {
              this.checkBoxValue[i][Number(answerArray[k]) - 1] = true;
            }
          } else if (this.questionList[i].type === 'multichoice') {
            // fill radiobuttons
            const answer = Number(this.answerList[j].value);
            this.radioBtnValue[i][answer - 1] = true;
            this.radioGroupValue[i] = String(answer - 1);
          }
        }
      }
    }
  }

  initArrays() {
    let i, j;
    for (i = 0; i < this.choicesList.length; i++) {
      this.checkBoxValue[i] = [];
      this.radioBtnValue[i] = [];
      this.radioGroupValue[i] = '';
      this.textBoxValue[i] = '';
      this.answerSelected[i] = true;
      if (this.questionList[i].type === 'multichoice') {
        for (j = 0; j < this.choicesList[i].length; j++) {
          if (this.isCheckbox[i]) {
            this.checkBoxValue[i][j] = false;
          } else {
            this.radioBtnValue[i][j] = false;
          }
        }
      }
    }

    this.previousPage[0] = 0;
    for (i = 1; i < this.questionList.length; i++) {
      this.previousPage[i] = i - 1;
    }
  }

  handleRadios(i, answer, event) {
    const j = event.detail.value;
    let k;
    if (this.questionList[i].type === 'multichoice') {
      for (k = 0; k < this.choicesList[i].length; k++) {
        this.radioBtnValue[i][k] = false;
      }
      this.radioBtnValue[i][j] = true;
      this.radioGroupValue[i] = j;
    }
    this.openURL(answer);
  }

  openURL(answer) {
    // tslint:disable-next-line: max-line-length
    const urlCheck = new RegExp(/(([a-z]+:\/\/)?(([a-z0-9\-]+\.)+((?!up)[a-z]{2}|aero|arpa|biz|com|coop|edu|gov|info|int|jobs|mil|museum|name|nato|net|org|pro|travel|local|internal))(:[0-9]{1,5})?(\/[a-z0-9_\-\.~]+)*(\/([a-z0-9_\-\.]*)(\?[a-z0-9+_\-\.%=&amp;]*)?)?(#[a-zA-Z0-9!$&'()*+.=-_~:@/?]*)?)(\s+|$)/gi);
    if (urlCheck.test(answer)) {
      urlCheck.lastIndex = 0;   // reset RegExp to start from the beginning
      const url = urlCheck.exec(answer)[0];
      if (!/^http[s]?:\/\//.test(url)) {
        const newUrl = 'http://' + url;
        this.handleWebIntentForWebsite(newUrl);
      } else {
        this.handleWebIntentForWebsite(url);
      }
    }
  }

  /**
   * @name openWebsite
   * @description opens a url depending on the platform
   * @param {string} url
   */
  private async handleWebIntentForWebsite(url: string) {
    if (this.platform.is('cordova')) {
      this.safariOrChrome.isAvailable().then((available: boolean) => {
        if (available) {
          this.openWithSafariOrChrome(url);
        } else { this.openWithInAppBrowser(url); }
      });
    } else { this.openWithInAppBrowser(url); }
  }

  /**
   * @name openWithInAppBrowser
   * @description opens a url with the InAppBrowser
   * @param {string} url
   */
  private openWithInAppBrowser(url: string) {
    const target = '_blank';
    this.inAppBrowser.create(url, target);
  }

  /**
   * @name openWithSafariOrChrome
   * @description opens a url with safari or chrome custom tabs
   * @param {string} url
   */
  private openWithSafariOrChrome(url: string) {
    this.safariOrChrome.show({
      url: url
    }).subscribe(
      result => { this.logger.debug('openWithSafariOrChrome', result); },
      error => { this.logger.error('openWithSafariOrChrome', error); }
    );
  }

  prepareChoices() {
    let i;
    for (i = 0; i < this.questionList.length; i++) {
      if (this.questionList[i].type === 'textarea') {
        this.isCheckbox[i] = false;
        this.choicesList[i] = [];
      } else if (this.questionList[i].type === 'multichoice') {
        const boxType = this.questionList[i].choices.split('>>>>>');
        const choiceArray = boxType[1].split('|');

        if (boxType[0] === 'c') {
          this.isCheckbox[i] = true;
        } else {
          this.isCheckbox[i] = false;
        }

        if (Array.isArray(choiceArray)) {
          for (let j = 0; j < choiceArray.length; j++) {
            choiceArray[j] = choiceArray[j].trim();
          }
        }

        this.choicesList[i] = choiceArray;
      }
    }
  }

  goBack() {
    let i, j;
    for (j = 0; j < this.isPageActive.length; j++) {
      if (this.isPageActive[j]) {
        i = j;
      }
    }
    if (this.questionList[i].dependitem !== '0') {
      if (this.questionList[i].type === 'textarea') {
        this.textBoxValue[i] = '';
      } else if (this.questionList[i].type === 'multichoice') {
        let k;
        for (k = 0; k < this.choicesList[i].length; k++) {
          if (this.isCheckbox[i]) {
            this.checkBoxValue[i][k] = false;
          } else {
            this.radioBtnValue[i][k] = false;
            this.radioGroupValue[i] = '';
          }
        }
      }
    }

    if (i > 0) {
      this.questionNavIndex -= 1;
      this.isPageActive[i] = false;
      this.isPageActive[this.previousPage[i]] = true;
      if (this.previousPage[i] === 0) {
        this.isFirstQuestion = true;
      }
    }
  }

  goBackLast() {
    this.questionNavIndex -= 1;
    this.answersSubmitted = false;
    this.isPageActive[this.latestPage] = true;
  }

  goForward() {
    let i, j;
    for (j = 0; j < this.isPageActive.length; j++) {
      if (this.isPageActive[j]) {
        i = j;
      }
    }
    this.isAnswerSelected(i);
    if (this.answerSelected[i] || this.isCompleted) {
      this.isPageActive[i] = false;
      this.questionNavIndex += 1;
      this.checkDependency(i + 1, i);
    }
  }

  checkDependency(i, p) {
    let j, k;
    if (i < this.questionList.length) {
      this.isFirstQuestion = false;
      if (this.questionList[i].dependitem.trim() === '0') {
        // next question is NOT a conditional question
        this.previousPage[i] = p;
        this.isPageActive[i] = true;
      } else {
        // next question is a conditional question
        for (j = 0; j < this.questionList.length; j++) {
          if (this.questionList[j].id.toString().trim() === this.questionList[i].dependitem.trim()) {
            // next question depends on answer from question j
            if (this.isCheckbox[j]) {
              // checkbox
              for (k = 0; k < this.choicesList[j].length; k++) {
                if (utils.processMoodleContents(
                    this.choicesList[j][k].trim()) === utils.processMoodleContents(this.questionList[i].dependvalue.trim())) {
                  if (this.checkBoxValue[j][k]) {
                    // condition fullfilled
                    this.previousPage[i] = p;
                    this.isPageActive[i] = true;
                  } else {
                    // condition NOT fullfilled
                    this.checkDependency(i + 1, p);
                  }
                }
              }
            } else {
              // radio
              for (k = 0; k < this.choicesList[j].length; k++) {
                if (utils.processMoodleContents(
                    this.choicesList[j][k].trim()) === utils.processMoodleContents(this.questionList[i].dependvalue.trim())) {
                  if (this.radioBtnValue[j][k]) {
                    // condition fullfilled
                    this.previousPage[i] = p;
                    this.isPageActive[i] = true;
                  } else {
                    // condition NOT fullfilled
                    this.checkDependency(i + 1, p);
                  }
                }
              }
            }
          }
        }
      }
    } else {

      this.latestPage = p;
      for (i = 0; i < this.isPageActive.length; i++) {
        this.isPageActive[i] = false;
      }
      this.answersSubmitted = true;

    }
  }

  sendAnswers() {
    // Submitten der Antworten im richtigen Format
    const resultArray: string[][] = [];
    let k, l;
    for (k = 0; k < this.questionList.length; k++) {
      resultArray[k] = [];
      resultArray[k][0] = this.questionList[k].id.toString();
      if (this.questionList[k].type === 'textarea') {
        resultArray[k][1] = this.textBoxValue[k];
      } else if (this.isCheckbox[k]) {
        let checkBoxString = '';
        for (l = 0; l < this.checkBoxValue[k].length; l++) {
          if (this.checkBoxValue[k][l]) {
            if (checkBoxString.trim() === '') {
              checkBoxString = checkBoxString.concat((l + 1));
            } else {
              checkBoxString = checkBoxString.concat('|' + (l + 1));
            }
          }
        }
        resultArray[k][1] = checkBoxString;
      } else {
        let radioString = '';
        for (l = 0; l < this.radioBtnValue[k].length; l++) {
          if (this.radioBtnValue[k][l]) {
            radioString = (l + 1).toString();
          }
        }
        resultArray[k][1] = radioString;
      }
    }

    this.questionProv.sendAnswers(
      this.feedbackID,
      resultArray,
      this.configService.getConfigById(this.session.courseID),
      this.session.token
    ).then(response => {
      this.logger.debug('sendAnswers()', 'successfully send answers', response);
    }).catch(error => {
      this.logger.error('sendAnswers()', 'error while sending answers', error);
    });
  }

  isAnswerSelected(i) {
    let k;
    if (this.questionList[i].type === 'textarea') {
      if (this.textBoxValue[i].trim() === '') {
        this.answerSelected[i] = false;
      } else {
        this.answerSelected[i] = true;
      }
    } else if (this.isCheckbox[i] && (this.questionList[i].type === 'multichoice')) {
      this.answerSelected[i] = false;
      for (k = 0; k < this.choicesList[i].length; k++) {
        if (this.checkBoxValue[i][k]) {
          this.answerSelected[i] = true;
        }
      }
    } else if (this.questionList[i].type === 'multichoice') {
      this.answerSelected[i] = false;
      for (k = 0; k < this.choicesList[i].length; k++) {
        if (this.radioBtnValue[i][k]) {
          this.answerSelected[i] = true;
        }
      }
    }
  }

  backToRoot() {
    this.sendAnswers();
    this.closeModal();
  }

  closeModal() {
    this.modalCtrl.dismiss();
  }

  htmlDecode(value) {
    try {
      const tmp = $('<textarea/>').html(value).text();
      if (!$(tmp).find('span')[1]) {
        return tmp;
      } else {
        const language = this.translate.currentLang;
        if (language === 'de') {
          return '<p>' + $(tmp).find('span').html() + '</p>';
        } else {
          return '<p>' + $(tmp).find('span').eq(1).html() + '</p>';
        }
      }
    } catch (e) {
      this.logger.error('htmlDecode()', e);
      return value;
    }
  }

}
