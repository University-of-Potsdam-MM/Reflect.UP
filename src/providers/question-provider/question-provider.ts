import { QuestionConfig } from '../../lib/interfaces/question';
import { IModuleConfig } from '../../lib/interfaces/config';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class QuestionProvider {

  private configStorageKey = "config";

  private wstoken;
  private course_id:string;
  private url:string;
  private accessToken:string;
  public readyObservable:Observable<boolean>;

  constructor(public http: HttpClient,
              public storage: Storage) {
    this.checkIfReady();
    this.loadParams();
  }

  private checkIfReady() {
    this.readyObservable = Observable.create(observer => {
      this.storage.get("questionParameterLoaded").then(
        loaded => {
          if (loaded) {
            observer.next(true);
          } else {
            observer.next(false);
          }
        }
      )
    });
  }

  public loadParams() {
    this.storage.get(this.configStorageKey).then((config:IModuleConfig) => {
      if (config) {
        this.url = config.moodleServiceEndpoint;
        this.course_id = config.courseID;
        this.accessToken = config.authorization.credentials.accessToken;
        this.storage.set("questionParameterLoaded", true);
      }
    });
    this.storage.get("session").then((token) => {
      if (token) {
        this.wstoken = token.token;
      }
    });
  }

  public getQuestions(): Observable<QuestionConfig> {

    let params:HttpParams = new HttpParams()
      .append("wstoken",              this.wstoken)
      .append("wsfunction",           "local_reflect_get_feedbacks")
      .append("moodlewsrestformat",   "json")
      .append("courseID",           this.course_id);
      // .append("courseID",              "UPR-1718-T"); // Test-Kurs

    let headers:HttpHeaders = new HttpHeaders()
      .append("Authorization",        this.accessToken);

    return this.http.get<QuestionConfig>(this.url, {headers:headers,params:params});
  }

  public getAnsweredQuestions(): Observable<QuestionConfig> {

    let params:HttpParams = new HttpParams()
      .append("wstoken",              this.wstoken)
      .append("wsfunction",           "local_reflect_get_completed_feedbacks")
      .append("moodlewsrestformat",   "json")
      .append("courseID",           this.course_id);

    let headers:HttpHeaders = new HttpHeaders()
      .append("Authorization",        this.accessToken);

    return this.http.get<QuestionConfig>(this.url, {headers:headers,params:params});
  }

 // resultID = ID der Feedback Kategorie
 // resultAnswerArray = Array mit jeweils Question-ID und Question-Antwort
 public sendAnswers(resultID:number, resultAnswersArray:string[][]) {

    var i;

    let headers:HttpHeaders = new HttpHeaders()
      .append("Authorization",        this.accessToken);

    var params:HttpParams = new HttpParams()
      .append("wstoken",              this.wstoken)
      .append("wsfunction",           "local_reflect_submit_feedbacks")
      .append("moodlewsrestformat",   "json")
      .append("id",                   resultID.toString());

    for (i = 0; i < resultAnswersArray.length; i++) {
      var answerIDstring, answerString;
      answerIDstring = "answers[" + i + "][id]";
      answerString = "answers[" + i + "][answer]";
      params = params.append(answerIDstring, resultAnswersArray[i][0]); // 0 = frage-id
      params = params.append(answerString,   resultAnswersArray[i][1]); // 1 = answer
    }

    // params = params.append("courseID",             "UPR-1718-T");
    params = params.append("courseID",             this.course_id);

    this.http.get(this.url, {headers:headers, params:params}).subscribe((data) => {
      // console.log(data);
    });
 }

}
