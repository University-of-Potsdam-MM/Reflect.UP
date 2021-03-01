import {
  ILoginConfig_Credentials,
  ILoginConfig_SSO,
} from "../services/login-provider/interfaces";

export interface IModuleConfig {
  id: number;
  faculty: string;
  type: string;
  appVersion: number;
  courseID: string;
  moodleServiceEndpoint: string;
  authorization: IAuthorization;
  pushDetails: PushDetails;
  title: string;
  institution: string;
  description: string;
  mintDetails?: IMintObject[];
  mintEnabled?: boolean;
  mintUrl?: string;
  uniLogo: string;
  contactPersonsObject: ContactPersonsObject[];
}

export interface IAuthorization {
  method: string;
  credentials: ILoginConfig_Credentials;
  sso: ILoginConfig_SSO;
}

interface ContactPersonsObject {
  category: string;
  content: ContactPersonsObject[];
}

interface PushDetails {
  senderID: string;
  uniqushUrl: string;
  service: string;
  XAnAppKey: string;
  authHeader: AccessToken;
}

interface AccessToken {
  accessToken: string;
}

export interface IMintObject {
  campus: string;
  schedule: IMintSchedule[];
}

interface IMintSchedule {
  tutor: string;
  subject: string;
  timeslot: IMintTimeslot[];
}

interface IMintTimeslot {
  day: string;
  time: string;
}
