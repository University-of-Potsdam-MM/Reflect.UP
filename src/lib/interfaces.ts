import { HttpParameterCodec, HttpClient } from "@angular/common/http";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";

/** Response of feedback webservice */
export interface IFeedbackResponse {
    result?:boolean;
    errorcode?:string;
    exception?:string;
    message?:string;
}

export class WebHttpUrlEncodingCodec implements HttpParameterCodec {
    encodeKey(k: string): string { return encodeURIComponent(k); }
    encodeValue(v: string): string { return encodeURIComponent(v); }
    decodeKey(k: string): string { return decodeURIComponent(k); }
    decodeValue(v: string) { return decodeURIComponent(v); }
}

export interface PageInterface {
    title: string;
    pageName: any;
    icon: string;
}

export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http, "./assets/i18n/", ".json");
}

export interface PushMessage {
    id: number;
    timestamp: any;
    title: string;
    message: string;
}