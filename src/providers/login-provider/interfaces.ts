import { InAppBrowserEvent, InAppBrowserObject } from "@ionic-native/in-app-browser";
import { Observer } from "rxjs/Observer";

/** Defines a LoginProvider, not that much right now, but can't hurt */
export interface ILoginProvider {

}

/** Errors that will be used by LoginProvider */
export enum ELoginErrors {
  AUTHENTICATION, TECHNICAL, NETWORK, UNKNOWN_METHOD, UNKNOWN_ERROR
}

/** Defines a LoginRequest that is given to each login method */
export interface ILoginRequest {
  credentials:ICredentials,
  // TODO: would be nice to unify the loginConfigs somehow, like:
  // loginConfig:ILoginConfig_SSO|ILoginConfig_OIDC|ILoginConfig_OIDC;
  loginAttemptStarted:boolean,
  ssoConfig?:ILoginConfig_SSO;
  oidcConfig?:ILoginConfig_OIDC;
  credentialsConfig?:ILoginConfig_Credentials;
}

/** Single action that can be triggered by an SSO browser event */
export interface IAction {
  event: string;
  condition(event:InAppBrowserEvent, loginRequest:ILoginRequest): boolean;
  action(event:InAppBrowserEvent, loginRequest:ILoginRequest, observer:Observer<ISession>):void;
}

/** Server response for ordinary credentials login */
export interface ICredentialsLoginResponse {
  token?:string;
}

/** Server response for OIDC login */
export interface IOIDCLoginResponse {
  access_token: string;
  refresh_token: string;
  scope: string;
  id_token: string;
  token_type: number;
  expires_in: number;
}

/** Credentials used for logging in */
export interface ICredentials {
  username: string;
  password: string;
}

/** Interface for the session to be saved in storage */
export interface ISession {
  credentials:ICredentials;
  token: string;
  oidcTokenObject?:IOIDCLoginResponse;
}

/* ~~~ config ~~~ */

/* SSO */
export interface ILoginConfig_SSO {
  browser:InAppBrowserObject;
  method:string;
  ssoUrls:ISSOUrls;
}

export interface ISSOUrls {
  loginUrl:string,
  pluginUrl:string;
  tokenUrl:string,
  idpBaseUrl:string,
  idpUrl:string,
  attributeReleaseUrl:string;
  pluginUrlParams:IPluginUrlParams;
}

export interface IPluginUrlParams {
  service:string;
  passport:string;
}


/* Credentials */
export interface ILoginConfig_Credentials {
  moodleLoginEndpoint:string;
  accessToken:string;
  service:string;
  moodlewsrestformat:string;
}

/* OIDC */
export interface ILoginConfig_OIDC {
  tokenUrl:string;
  accessToken:string;
  contentType:string;
  grantType:string;
  scope:string;
}

