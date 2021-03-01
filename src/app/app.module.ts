import { NgModule, APP_INITIALIZER } from "@angular/core";
import {
  BrowserModule,
  HammerGestureConfig,
  HAMMER_GESTURE_CONFIG,
} from "@angular/platform-browser";
import { RouteReuseStrategy } from "@angular/router";
import { IonicModule, IonicRouteStrategy } from "@ionic/angular";
import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { StatusBar } from "@ionic-native/status-bar/ngx";
import { AppComponent } from "./app.component";
import { AppRoutingModule } from "./app-routing.module";
import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { ConfigService } from "./services/config/config.service";
import { IonicStorageModule } from "@ionic/storage";
import { UPLoginProvider } from "./services/login-provider/login";
import { environment } from "src/environments/environment";
import { CacheModule } from "ionic-cache";
import { LoggingService } from "ionic-logging-service";
import { HttpLoaderFactory } from "./lib/interfaces";
import { InAppBrowser } from "@ionic-native/in-app-browser/ngx";
import { Network } from "@ionic-native/network/ngx";
import { Push } from "@ionic-native/push/ngx";
import { LocalNotifications } from "@ionic-native/local-notifications/ngx";
import { HTTP } from "@ionic-native/http/ngx";
import { SafariViewController } from "@ionic-native/safari-view-controller/ngx";
import { File } from "@ionic-native/file/ngx";
import { EmailComposer } from "@ionic-native/email-composer/ngx";
import { Device } from "@ionic-native/device/ngx";

export function initConfig(config: ConfigService) {
  return () => config.load("assets/config.json");
}

export class IonicGestureConfig extends HammerGestureConfig {
  buildHammer(element: HTMLElement) {
    const mc = new (<any>window).Hammer(element);

    for (const eventName in this.overrides) {
      if (eventName) {
        mc.get(eventName).set(this.overrides[eventName]);
      }
    }

    return mc;
  }
}

export function configureLogging(loggingService: LoggingService): () => void {
  return () => loggingService.configure(environment.logging);
}

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot({
      backButtonIcon: "chevron-back",
      backButtonText: "",
      mode: "md",
      rippleEffect: true,
    }),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
    IonicStorageModule.forRoot({
      driverOrder: ["indexeddb", "sqlite", "websql", "localstorage"],
    }),
    CacheModule.forRoot({ keyPrefix: "cache-" }),
    HttpClientModule,
    AppRoutingModule,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    UPLoginProvider,
    ConfigService,
    Network,
    Push,
    HTTP,
    File,
    EmailComposer,
    Device,
    InAppBrowser,
    SafariViewController,
    LocalNotifications,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: HAMMER_GESTURE_CONFIG, useClass: IonicGestureConfig },
    {
      provide: APP_INITIALIZER,
      useFactory: initConfig,
      deps: [ConfigService],
      multi: true,
    },
    {
      deps: [LoggingService],
      multi: true,
      provide: APP_INITIALIZER,
      useFactory: configureLogging,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
