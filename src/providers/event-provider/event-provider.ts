import { Observable } from 'rxjs/Observable';
import { AppointConfig } from '../../lib/interfaces/appointm';
import { IModuleConfig } from '../../lib/interfaces/config';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map'
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { CacheService } from "ionic-cache";

@Injectable()
export class EventProvider {

  private configStorageKey = "config";

  private wstoken;
  private url:string;
  private course_id:string;
  private accessToken:string;
  public readyObservable:Observable<boolean>;

  constructor(private http: HttpClient, public storage: Storage, private cache: CacheService) {
    this.checkIfReady();
    this.loadParams();
  }

  private checkIfReady() {
    this.readyObservable = Observable.create(observer => {
      this.storage.get("eventParameterLoaded").then(loaded => {
        if (loaded) {
          observer.next(true);
        } else {
          observer.next(false);
        }
      });
    });
  }

  public loadParams() {
    this.storage.get(this.configStorageKey).then((config:IModuleConfig) => {
      if (config) {
        this.url = config.moodleServiceEndpoint;
        this.course_id = config.courseID;
        this.accessToken = config.authorization.credentials.accessToken;
        this.storage.set("eventParameterLoaded", true);
      }
    });
    this.storage.get("session").then(token => {
      if (token) {
        this.wstoken = token.token;
      }
    });
  }

  public getAppointments(): Observable<AppointConfig> {

    var today = new Date();
    var oneYearLater = new Date();
    oneYearLater.setFullYear(today.getFullYear()+1);

    let params:HttpParams = new HttpParams()
      .append("wstoken",                this.wstoken)
      .append("wsfunction",             "local_reflect_get_calendar_entries")
      .append("moodlewsrestformat",     "json")
      .append("options[userevents]",    "0")
      .append("options[siteevents]",    "0")
      .append("options[timestart]",      Math.floor(today.getTime() / 1000).toString())
      .append("options[timeend]",        Math.floor(oneYearLater.getTime() / 1000).toString())
      .append("options[ignorehidden]",   "1")
      .append("courseID",               this.course_id);

    let headers:HttpHeaders = new HttpHeaders()
      .append("Authorization",      this.accessToken);

    let request = this.http.get<AppointConfig>(this.url, {headers:headers,params:params});

    return this.cache.loadFromObservable("cachedEvents", request);

  }

}
