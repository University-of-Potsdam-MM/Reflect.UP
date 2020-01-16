import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { CacheService } from 'ionic-cache';
import { QuestionConfig } from 'src/app/lib/question';
import { IModuleConfig } from 'src/app/lib/config';
import { Observable } from 'rxjs/Observable';

@Injectable({
  providedIn: 'root'
})
export class QuestionService {

  constructor(
    private http: HttpClient,
    private cache: CacheService
  ) { }

  public getQuestions(config: IModuleConfig, token, forceReload?): Observable<QuestionConfig> {

    const url = config.moodleServiceEndpoint;
    const courseID = config.courseID;
    const accessToken = config.authorization.credentials.authHeader.accessToken;

    const params: HttpParams = new HttpParams()
      .append('wstoken',              token)
      .append('wsfunction',           'local_reflect_get_feedbacks')
      .append('moodlewsrestformat',   'json')
      .append('courseID',             courseID);

    const headers: HttpHeaders = new HttpHeaders()
      .append('Authorization', accessToken);

    const request = this.http.get<QuestionConfig>(url, {headers: headers, params: params});

    if (forceReload) { this.cache.removeItem('cachedQuestions' + courseID); }

    return this.cache.loadFromObservable('cachedQuestions' + courseID, request);
  }

  public getAnsweredQuestions(config: IModuleConfig, token, forceReload?): Observable<QuestionConfig> {

    const url = config.moodleServiceEndpoint;
    const courseID = config.courseID;
    const accessToken = config.authorization.credentials.authHeader.accessToken;

    const params: HttpParams = new HttpParams()
      .append('wstoken',              token)
      .append('wsfunction',           'local_reflect_get_completed_feedbacks')
      .append('moodlewsrestformat',   'json')
      .append('courseID',             courseID);

    const headers: HttpHeaders = new HttpHeaders()
      .append('Authorization', accessToken);

    const request = this.http.get<QuestionConfig>(url, {headers: headers, params: params});

    if (forceReload) { this.cache.removeItem('cachedCompletedQuestions' + courseID); }

    return this.cache.loadFromObservable('cachedCompletedQuestions' + courseID, request);
  }

 // resultID = ID der Feedback Kategorie
 // resultAnswerArray = Array mit jeweils Question-ID und Question-Antwort
 public async sendAnswers(resultID: number, resultAnswersArray: string[][], config: IModuleConfig, token) {

    let i;

    const url = config.moodleServiceEndpoint;
    const courseID = config.courseID;
    const accessToken = config.authorization.credentials.authHeader.accessToken;

    const headers: HttpHeaders = new HttpHeaders()
      .append('Authorization', accessToken);

    let params: HttpParams = new HttpParams()
      .append('wstoken',              token)
      .append('wsfunction',           'local_reflect_submit_feedbacks')
      .append('moodlewsrestformat',   'json')
      .append('id',                   resultID.toString());

    for (i = 0; i < resultAnswersArray.length; i++) {
      let answerIDstring, answerString;
      answerIDstring = 'answers[' + i + '][id]';
      answerString = 'answers[' + i + '][answer]';
      params = params.append(answerIDstring, resultAnswersArray[i][0]); // 0 = frage-id
      params = params.append(answerString,   resultAnswersArray[i][1]); // 1 = answer
    }

    params = params.append('courseID', courseID);

    await this.http.get(url, {headers: headers, params: params});
 }
}
