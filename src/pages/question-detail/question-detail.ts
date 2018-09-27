import { HomePage } from './../home/home';
import { QuestionsPage } from './../questions/questions';
import { QuestionProvider } from '../../providers/question-provider/question-provider';
import { TranslateService } from '@ngx-translate/core';
import { QuestionsObject, AnswerObject } from '../../lib/interfaces/question';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import * as $ from 'jquery';
import * as _ from 'underscore';
import { Storage } from '@ionic/storage';
import { IModuleConfig } from '../../lib/interfaces/config';

@IonicPage()
@Component({
  selector: 'page-question-detail',
  templateUrl: 'question-detail.html',
})
export class QuestionDetailPage {

  public answersSubmitted = false;
  public isFirstQuestion = true;
  public checkBoxValue:boolean[][] = [];
  public radioBtnValue:boolean[][] = [];
  public textBoxValue:string[] = [];
  public answerSelected:boolean[] = [];

  public feedbackID;
  public feedbackMessage;
  public isCompleted;
  public questionList: QuestionsObject[] = [];
  public answerList: AnswerObject[];
  public choicesList:string[][] = [];
  public isCheckbox:boolean[] = [];
  public isPageActive:boolean[] = [false];
  public previousPage:number[] = [];
  public latestPage = 0;
  public questionNavIndex = 1;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private translate: TranslateService,
              private questionProv: QuestionProvider,
              private storage: Storage) {
    this.feedbackID = navParams.get('id');

    var tmpQuestionList = navParams.get('questions');
    var i;
    for (i = 0; i < tmpQuestionList.length; i++) {
      if (tmpQuestionList[i].type == "multichoice" || tmpQuestionList[i].type == "textarea") {
        this.questionList.push(tmpQuestionList[i]);
      }
    }
    this.feedbackMessage = this.htmlDecode(navParams.get('message'));
    this.isCompleted = navParams.get('isCompleted');
    this.isPageActive[0] = true;
    this.prepareChoices();
    this.initArrays();
    if (this.isCompleted) {
      this.answerList = navParams.get('answers');
      this.prepareCompletedAnswers();
    }

  }

  prepareCompletedAnswers() {
    var i,j,k;

    for (i = 0; i < this.questionList.length; i++) {
      for (j = 0; j < this.answerList.length; j++) {

        if (this.questionList[i].id == this.answerList[j].item) {

          if (this.questionList[i].type == "textarea") {
            // fill in text value
            this.textBoxValue[i] = this.answerList[j].value;
          } else if (this.isCheckbox[i] && (this.questionList[i].type == "multichoice")) {
            // fill checkboxes
            let answerArray = this.answerList[j].value.split("|");
            for (k = 0; k < answerArray.length; k++) {
              this.checkBoxValue[i][Number(answerArray[k])-1] = true;
            }
          } else if (this.questionList[i].type == "multichoice") {
            // fill radiobuttons
            let answer = Number(this.answerList[j].value);
            this.radioBtnValue[i][answer-1] = true;
          }
        }
      }
    }
  }

  initArrays() {
    var i,j;
    for (i = 0; i < this.choicesList.length; i++) {
      this.checkBoxValue[i] = [];
      this.radioBtnValue[i] = [];
      this.textBoxValue[i] = "";
      this.answerSelected[i] = true;
      if (this.questionList[i].type == "multichoice") {
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
      this.previousPage[i] = i-1;
    }
  }

  handleRadios(i,j, answer) {
    var k;
    if (this.questionList[i].type == "multichoice") {
      for (k = 0; k < this.choicesList[i].length; k++) {
        this.radioBtnValue[i][k] = false;
      }
      this.radioBtnValue[i][j] = true;
    }
    this.openURL(answer);
  }

  openURL(answer) {
    var urlCheck = new RegExp(/(([a-z]+:\/\/)?(([a-z0-9\-]+\.)+((?!up)[a-z]{2}|aero|arpa|biz|com|coop|edu|gov|info|int|jobs|mil|museum|name|nato|net|org|pro|travel|local|internal))(:[0-9]{1,5})?(\/[a-z0-9_\-\.~]+)*(\/([a-z0-9_\-\.]*)(\?[a-z0-9+_\-\.%=&amp;]*)?)?(#[a-zA-Z0-9!$&'()*+.=-_~:@/?]*)?)(\s+|$)/gi);
    if (urlCheck.test(answer)) {
      urlCheck.lastIndex = 0;   // reset RegExp to start from the beginning
      var url = urlCheck.exec(answer)[0];
      if (!/^http[s]?:\/\//.test(url)) {
        var newUrl = "http://" + url;
        window.open(newUrl, '_blank');
      } else {
        window.open(url, '_blank');
      }
    }
  }

  prepareChoices() {
    var i;
    for (i = 0; i < this.questionList.length; i++) {
      if (this.questionList[i].type == "textarea") {
        this.isCheckbox[i] = false;
        this.choicesList[i] = [];
      } else if (this.questionList[i].type == "multichoice") {
        var boxType = this.questionList[i].choices.split('>>>>>');
        var choiceArray = boxType[1].split('|');

        if (boxType[0] == "c") {
          this.isCheckbox[i] = true;
        } else {
          this.isCheckbox[i] = false;
        }

        this.choicesList[i] = choiceArray;
      }
    }
  }

  processMoodleContents(stringToAnalize:string, shorterURL?:boolean) {
    //checking for multi language tags
    
    stringToAnalize = this.urlify(stringToAnalize, shorterURL);

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

  goBack() {
    var i,j;
    for (j = 0; j < this.isPageActive.length; j++) {
      if (this.isPageActive[j]) {
        i = j;
      }
    }
    if (this.questionList[i].dependitem != "0") {
      if (this.questionList[i].type == "textarea") {
        this.textBoxValue[i] = "";
      } else if (this.questionList[i].type == "multichoice") {
        var k;
        for (k = 0; k < this.choicesList[i].length; k++) {
          if (this.isCheckbox[i]) {
            this.checkBoxValue[i][k] = false;
          } else {
            this.radioBtnValue[i][k] = false;
          }
        }
      }
    }

    if (i > 0) {
      this.questionNavIndex -= 1;
      this.isPageActive[i] = false;
      this.isPageActive[this.previousPage[i]] = true;
      if (this.previousPage[i] == 0) {
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
    var i,j;
    for (j = 0; j < this.isPageActive.length; j++) {
      if (this.isPageActive[j]) {
        i = j;
      }
    }
    this.isAnswerSelected(i);
    if (this.answerSelected[i] || this.isCompleted) {
      this.isPageActive[i] = false;
      this.questionNavIndex += 1;
      this.checkDependency(i+1,i);
    }
  }

  checkDependency(i,p) {
    var j,k;
    if (i < this.questionList.length) {
      this.isFirstQuestion = false;
      if (this.questionList[i].dependitem == "0") {
        // next question is NOT a conditional question
        this.previousPage[i] = p;
        this.isPageActive[i] = true;
      } else {
        // next question is a conditional question
        for (j = 0; j < this.questionList.length; j++) {
          if (this.questionList[j].id.toString() == this.questionList[i].dependitem) {
            // next question depends on answer from question j
            if (this.isCheckbox[j]) {
              // checkbox
              for (k = 0; k < this.choicesList[j].length; k++) {
                if (this.processMoodleContents(this.choicesList[j][k].trim()) == this.processMoodleContents(this.questionList[i].dependvalue)) {
                  if (this.checkBoxValue[j][k]) {
                    // condition fullfilled
                    this.previousPage[i] = p;
                    this.isPageActive[i] = true;
                  } else {
                    // condition NOT fullfilled
                    this.checkDependency(i+1,p);
                  }
                }
              }
            } else {
              // radio
              for (k = 0; k < this.choicesList[j].length; k++) {
                if (this.processMoodleContents(this.choicesList[j][k].trim()) == this.processMoodleContents(this.questionList[i].dependvalue)) {
                  if (this.radioBtnValue[j][k]) {
                    console.log(this.radioBtnValue[j][k]);
                    // condition fullfilled
                    this.previousPage[i] = p;
                    this.isPageActive[i] = true;
                  } else {
                    // condition NOT fullfilled
                    this.checkDependency(i+1,p);
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
    var resultArray:string[][] = [];
    var k,l;
    for (k = 0; k < this.questionList.length; k++) {
      resultArray[k] = [];
      resultArray[k][0] = this.questionList[k].id.toString();
      if (this.questionList[k].type == "textarea") {
        resultArray[k][1] = this.textBoxValue[k]
      } else if (this.isCheckbox[k]) {
        var checkBoxString = "";
        for (l = 0; l < this.checkBoxValue[k].length; l++) {
          if (this.checkBoxValue[k][l]) {
            if (checkBoxString == "") {
              checkBoxString = checkBoxString.concat((l+1));
            } else {
              checkBoxString = checkBoxString.concat("|" + (l+1));
            }
          }
        }
        resultArray[k][1] = checkBoxString;
      } else {
        var radioString = "";
        for (l = 0; l < this.radioBtnValue[k].length; l++) {
          if (this.radioBtnValue[k][l]) {
            radioString = (l+1).toString();
          }
        }
        resultArray[k][1] = radioString;
      }
    }

    this.storage.get("config").then((config:IModuleConfig) => {
      this.storage.get("session").then(session => {
        this.questionProv.sendAnswers(this.feedbackID, resultArray, config, session.token);
      });
    });
  }

  isAnswerSelected(i) {
    var k;
    if (this.questionList[i].type == "textarea") {
      if (this.textBoxValue[i] == "") {
        this.answerSelected[i] = false;
      } else {
        this.answerSelected[i] = true;
      }
    } else if (this.isCheckbox[i] && (this.questionList[i].type == "multichoice")) {
      this.answerSelected[i] = false;
      for (k = 0; k < this.choicesList[i].length; k++) {
        if (this.checkBoxValue[i][k]) {
          this.answerSelected[i] = true;
        }
      }
    } else if (this.questionList[i].type == "multichoice") {
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
    this.navCtrl.setRoot(HomePage, { fromSideMenu: true });
    this.navCtrl.push(QuestionsPage, { forceReload: true });
  }

  htmlDecode(value) {
    var tmp = $("<textarea/>").html(value).text();
    if (!$(tmp).find('span')[1]) {
      return tmp;
    } else {
      let language = this.translate.currentLang;
      if (language == "de") {
        return "<p>" + $(tmp).find('span').html() + "</p>";
      } else {
        return "<p>" + $(tmp).find('span').eq(1).html() + "</p>";
      }
    }
  }

  // adds http:// to URLs like www.uni.de or uni.de
  urlify(text, shorterURL?:boolean) {
    var urlRegex = /(([a-z]+:\/\/)?(([a-z0-9\-]+\.)+((?!up)[a-z]{2}|aero|arpa|biz|com|coop|edu|gov|info|int|jobs|mil|museum|name|nato|net|org|pro|travel|local|internal))(:[0-9]{1,5})?(\/[a-z0-9_\-\.~]+)*(\/([a-z0-9_\-\.]*)(\?[a-z0-9+_\-\.%=&amp;]*)?)?(#[a-zA-Z0-9!$&'()*+.=-_~:@/?]*)?)(\s+|$)/gi;
    
    // shortens the URL to just show the main-domain if shorterURL == true
    if (shorterURL) {
      return text.replace(urlRegex, function(url) {
        var regShortURL = new RegExp(urlRegex);
        regShortURL.lastIndex = 0;
        var tmpUrl = regShortURL.exec(url)[3];
        tmpUrl = "(Website: " + tmpUrl.replace('www.','') + ")";
        console.log(tmpUrl);
        return tmpUrl;
      });
    } else {
      return text.replace(urlRegex, function(url) {
        if (!/^http[s]?:\/\//.test(url)) {
          url = "http://" + url.replace('www.','');
        }
        return url;
      });
    }
  }

}
