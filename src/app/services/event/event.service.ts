import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { CacheService } from 'ionic-cache';
import { AppointConfig } from 'src/app/lib/appointm';
import { IModuleConfig } from 'src/app/lib/config';
import { Observable } from 'rxjs/Observable';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  constructor(
    private http: HttpClient,
    private cache: CacheService
  ) { }

  public getAppointments(config: IModuleConfig, token, forceReload?): Observable<AppointConfig> {

    const url = config.moodleServiceEndpoint;
    const courseID = config.courseID;
    const accessToken = config.authorization.credentials.authHeader.accessToken;

    const today = new Date();
    const oneYearLater = new Date();
    oneYearLater.setFullYear(today.getFullYear() + 1);

    const params: HttpParams = new HttpParams()
      .append('wstoken',                token)
      .append('wsfunction',             'local_reflect_get_calendar_entries')
      .append('moodlewsrestformat',     'json')
      .append('options[userevents]',    '0')
      .append('options[siteevents]',    '0')
      .append('options[timestart]',      Math.floor(today.getTime() / 1000).toString())
      .append('options[timeend]',        Math.floor(oneYearLater.getTime() / 1000).toString())
      .append('options[ignorehidden]',   '1')
      .append('courseID',                courseID);

    const headers: HttpHeaders = new HttpHeaders()
      .append('Authorization', accessToken);

    const request = this.http.get<AppointConfig>(url, {headers: headers, params: params});

    if (forceReload) { this.cache.removeItem('cachedEvents' + courseID); }

    return this.cache.loadFromObservable('cachedEvents' + courseID, request);

  }
}
