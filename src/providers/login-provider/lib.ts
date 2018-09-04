import { HttpParameterCodec } from '@angular/common/http';
import { ICredentials } from "./interfaces";

/**
 * cleans provided username. Puts it to lowercase and removes optional mail suffix.
 * It is expected that credentials given to a LoginProvider have been cleaned by
 * this method.
 * @param {ICredentials} credentials
 * @return {ICredentials} cleaned credentials
 */
export function cleanCredentials(credentials:ICredentials):ICredentials{
  let atChar = "@";

  // only username needs cleaning, actually
  let cleanedUsername:string = credentials.username.toLowerCase().substring(
    0,
    credentials.username.includes(atChar)
      ? credentials.username.lastIndexOf(atChar)
      : credentials.username.length
  );

  return {
    username: cleanedUsername,
    password: credentials.password
  }
}

/**
 * returns whether 'subset' is a subst of 'string'. Actually just a shorter way
 * for calling '.indexOf(...) != -1'
 * @param {string} string
 * @param {string} subset
 * @returns {boolean}
 */
export function isSubset(string:string, subset:string) {
  return string.indexOf(subset) != -1;
}

/**
 * A `HttpParameterCodec` that uses `encodeURIComponent` and `decodeURIComponent` to
 * serialize and parse URL parameter keys and values.
 *
 * see https://github.com/angular/angular/issues/11058
 */
export class WebHttpUrlEncodingCodec implements HttpParameterCodec {
  encodeKey(k: string): string { return encodeURIComponent(k); }
  encodeValue(v: string): string { return encodeURIComponent(v); }
  decodeKey(k: string): string { return decodeURIComponent(k); }
  decodeValue(v: string) { return decodeURIComponent(v); }
}

/**
 * constructs and returns an URL by adding base and parameters together
 * @param pluginUrlBase
 * @param params
 * @returns {string}
 */
export function constructPluginUrl(pluginUrlBase, params):string {

  let parameters = [];
  for (let key in params) {
    parameters.push(encodeURIComponent(key) + '=' + encodeURIComponent(params[key]));
  }
  let pluginUrl = `${pluginUrlBase}${pluginUrlBase.slice(-1)=="?" ? "" : "?"}${parameters.join('&')}`;

  console.log(`[LoginProvider]: Created pluginUrl: ${pluginUrl}`);
  return pluginUrl;
}
