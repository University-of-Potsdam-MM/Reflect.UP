import { ILoginConfig_Credentials, ILoginConfig_SSO } from '../../providers/login-provider/interfaces';
export interface IModuleConfig
{
	id:number;
	appVersion:number;
	courseID:string;
	moodleServiceEndpoint:string;
	authorization:IAuthorization;
	pushDetails:PushDetails;
	title:string;
	institution:string;
	description:string;
	impressumTemplate:string;
	uniLogo:string;
	contactPersonsObject:ContactPersonsObject[];
}

export interface IAuthorization {
	method:string;
	credentials: ILoginConfig_Credentials;
	sso: ILoginConfig_SSO;
}

interface ContactPersonsObject
{
	category:string;
	content:ContactPersonsObject[];
}

interface PushDetails
{
	senderID:string;
	uniqushUrl:string;
	service:string;
	XAnAppKey:string;
	authHeader:AccessToken;
}

interface AccessToken
{
	Authorization:string;
}
