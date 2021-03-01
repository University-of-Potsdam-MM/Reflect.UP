import * as $ from "jquery";
import * as _ from "underscore";
import { Injector, Type } from "@angular/core";
import { StaticInjectorService } from "../pages/abstract-page";
import { TranslateService } from "@ngx-translate/core";

export module utils {
  // adds http:// to URLs like www.uni.de or uni.de
  export function urlify(text, shorterURL?: boolean) {
    const urlRegex = /(([a-z]+:\/\/)?(([a-z0-9-]+\.)+((?!up)[a-z]{2}|aero|arpa|biz|com|coop|edu|gov|info|int|jobs|mil|museum|name|nato|net|org|pro|travel|local|internal))(:[0-9]{1,5})?(\/[a-z0-9_\-.~]+)*(\/([a-z0-9_\-.]*)(\?[a-z0-9+_\-.%=&amp;]*)?)?(#[a-zA-Z0-9!$&'()*+.=-_~:@/?]*)?)(\s+|$)/gi;

    // shortens the URL to just show the main-domain if shorterURL === true
    if (text && shorterURL) {
      return text.replace(urlRegex, function (url) {
        const regShortURL = new RegExp(urlRegex);
        regShortURL.lastIndex = 0;
        let tmpUrl = regShortURL.exec(url)[3];
        tmpUrl = "(Website: " + tmpUrl.replace("www.", "") + ")";
        return tmpUrl;
      });
    } else if (text) {
      return text.replace(urlRegex, function (url) {
        if (!/^http[s]?:\/\//.test(url)) {
          url = "http://" + url.replace("www.", "");
        }
        return url;
      });
    } else {
      return text;
    }
  }

  export function processMoodleContents(
    stringToAnalize: string,
    shorterURL?: boolean
  ) {
    // checking for multi language tags

    try {
      stringToAnalize = this.urlify(stringToAnalize, shorterURL);

      const domObj = $($.parseHTML(stringToAnalize));
      let result = stringToAnalize;

      const injector: Injector = StaticInjectorService.getInjector();
      const translate = injector.get<TranslateService>(
        TranslateService as Type<TranslateService>
      );
      const language = translate.currentLang;

      if (domObj.length > 1) {
        _.each(domObj, function (element) {
          if ($(element)[0].lang === language) {
            result = $(element).html();
          }
        });

        // since there are some strings without spanish translation
        // use englisch as a fallback
        if (result === stringToAnalize) {
          _.each(domObj, function (element) {
            if ($(element)[0].lang === "en") {
              result = $(element).html();
            }
          });
        }
      }

      return result;
    } catch (error) {
      console.log(error);
      return stringToAnalize;
    }
  }
}
