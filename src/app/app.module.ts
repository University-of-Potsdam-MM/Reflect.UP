import { NgModule, APP_INITIALIZER } from '@angular/core';
import { BrowserModule, HammerGestureConfig, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ConfigService } from './services/config/config.service';
import { IonicStorageModule } from '@ionic/storage';
import { UPLoginProvider } from './services/login-provider/login';
import { environment } from 'src/environments/environment';
import { CacheModule } from 'ionic-cache';
import { LoggingService } from 'ionic-logging-service';
import { HttpLoaderFactory } from './lib/interfaces';

export function initConfig(config: ConfigService) {
  return () => config.load('assets/config.json');
}

export class IonicGestureConfig extends HammerGestureConfig {
  buildHammer(element: HTMLElement) {
      const mc = new (<any> window).Hammer(element);

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
  declarations: [
    AppComponent
  ],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot({
      backButtonIcon: 'ios-arrow-back',
      backButtonText: '',
      mode: 'md',
      rippleEffect: true
    }),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (HttpLoaderFactory),
        deps: [HttpClient]
      }
    }),
    IonicStorageModule.forRoot({
      driverOrder: ['indexeddb', 'sqlite', 'websql', 'localstorage']
    }),
    CacheModule.forRoot({ keyPrefix: 'cache-' }),
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [
    StatusBar,
    SplashScreen,
    UPLoginProvider,
    ConfigService,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: HAMMER_GESTURE_CONFIG, useClass: IonicGestureConfig },
    {
      provide: APP_INITIALIZER,
      useFactory: initConfig,
      deps: [ConfigService],
      multi: true
    },
    {
      deps: [LoggingService],
      multi: true,
      provide: APP_INITIALIZER,
      useFactory: configureLogging
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
