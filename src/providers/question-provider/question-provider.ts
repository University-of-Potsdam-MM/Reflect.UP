import { QuestionConfig } from '../../lib/interfaces/question';
import { IModuleConfig } from '../../lib/interfaces/config';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { CacheService } from "ionic-cache";

@Injectable()
export class QuestionProvider {

  constructor(private http: HttpClient, private cache: CacheService) 
  { }

  public getQuestions(config:IModuleConfig, token, forceReload?): Observable<QuestionConfig> {

    var url = config.moodleServiceEndpoint;
    var courseID = config.courseID;
    var accessToken = config.authorization.credentials.accessToken;

    let params:HttpParams = new HttpParams()
      .append("wstoken",              token)
      .append("wsfunction",           "local_reflect_get_feedbacks")
      .append("moodlewsrestformat",   "json")
      .append("courseID",             courseID);

    let headers:HttpHeaders = new HttpHeaders()
      .append("Authorization", accessToken);

    let request = this.http.get<QuestionConfig>(url, {headers:headers,params:params});

    if (forceReload) { this.cache.removeItem("cachedQuestions"); }

    return this.cache.loadFromObservable("cachedQuestions", request);
  }

  public getAnsweredQuestions(config:IModuleConfig, token, forceReload?): Observable<QuestionConfig> {

    var url = config.moodleServiceEndpoint;
    var courseID = config.courseID;
    var accessToken = config.authorization.credentials.accessToken;

    let params:HttpParams = new HttpParams()
      .append("wstoken",              token)
      .append("wsfunction",           "local_reflect_get_completed_feedbacks")
      .append("moodlewsrestformat",   "json")
      .append("courseID",             courseID);

    let headers:HttpHeaders = new HttpHeaders()
      .append("Authorization", accessToken);

    let request = this.http.get<QuestionConfig>(url, {headers:headers,params:params});

    if (forceReload) { this.cache.removeItem("cachedCompletedQuestions"); }

    return this.cache.loadFromObservable("cachedCompletedQuestions", request);
  }

 // resultID = ID der Feedback Kategorie
 // resultAnswerArray = Array mit jeweils Question-ID und Question-Antwort
 public sendAnswers(resultID:number, resultAnswersArray:string[][], config:IModuleConfig, token) {

    var i;

    var url = config.moodleServiceEndpoint;
    var courseID = config.courseID;
    var accessToken = config.authorization.credentials.accessToken;

    let headers:HttpHeaders = new HttpHeaders()
      .append("Authorization", accessToken);

    var params:HttpParams = new HttpParams()
      .append("wstoken",              token)
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

    params = params.append("courseID", courseID);

    this.http.get(url, {headers:headers, params:params}).subscribe((data) => {
      console.log(data);
    });
 }

}
