import { Observable } from 'rxjs/Observable';
import { AppointConfig } from '../../lib/interfaces/appointm';
import { IModuleConfig } from '../../lib/interfaces/config';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map'
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { CacheService } from "ionic-cache";

@Injectable()
export class EventProvider {

  constructor(private http: HttpClient, private cache: CacheService) 
  { }

  public getAppointments(config:IModuleConfig, token, forceReload?): Observable<AppointConfig> {

    var url = config.moodleServiceEndpoint;
    var courseID = config.courseID;
    var accessToken = config.authorization.credentials.authHeader.accessToken;


    var today = new Date();
    var oneYearLater = new Date();
    oneYearLater.setFullYear(today.getFullYear()+1);

    let params:HttpParams = new HttpParams()
      .append("wstoken",                token)
      .append("wsfunction",             "local_reflect_get_calendar_entries")
      .append("moodlewsrestformat",     "json")
      .append("options[userevents]",    "0")
      .append("options[siteevents]",    "0")
      .append("options[timestart]",      Math.floor(today.getTime() / 1000).toString())
      .append("options[timeend]",        Math.floor(oneYearLater.getTime() / 1000).toString())
      .append("options[ignorehidden]",   "1")
      .append("courseID",                courseID);

    let headers:HttpHeaders = new HttpHeaders()
      .append("Authorization", accessToken);

    let request = this.http.get<AppointConfig>(url, {headers:headers,params:params});

    if (forceReload) { this.cache.removeItem("cachedEvents"); }

    return this.cache.loadFromObservable("cachedEvents", request);

  }

}
