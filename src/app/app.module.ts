import { ComponentsModule } from './../components/components.module';
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { IonicStorageModule } from '@ionic/storage';
import { Network } from '@ionic-native/network';
import { StatusBar } from '@ionic-native/status-bar';
import { ConnectionProvider } from '../providers/connection-provider/connection-provider';
import { SplashScreen } from '@ionic-native/splash-screen';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { EventProvider } from '../providers/event-provider/event-provider';
import { Push } from '@ionic-native/push';
import { UPLoginProvider } from '../providers/login-provider/login';
import { QuestionProvider } from '../providers/question-provider/question-provider';
import { InAppBrowser } from "@ionic-native/in-app-browser";
import { PushProvider } from '../providers/push-provider/push-provider';
import { Keyboard } from '@ionic-native/keyboard';
import { HttpLoaderFactory } from '../lib/interfaces';
import { CalendarModule } from 'ion2-calendar';
import { CacheModule } from 'ionic-cache';
import { PhotoViewer } from '@ionic-native/photo-viewer';
import { File } from '@ionic-native/file';

/* ~~~ Pages ~~~ */
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { SettingsPage } from '../pages/settings/settings';
import { LoginPage } from '../pages/login/login';
import { LogoutPage } from '../pages/logout/logout'
import { QuestionsPage } from '../pages/questions/questions';
import { AppointmentsPage } from '../pages/appointments/appointments';
import { ContactsPage } from '../pages/contacts/contacts';
import { FeedbackPage } from '../pages/feedback/feedback';
import { SelectModulePage } from '../pages/select-module/select-module';
import { ImpressumPage } from './../pages/impressum/impressum';
import { DisagreeTosPage } from './../pages/disagree-tos/disagree-tos';
import { PopoverPage } from './../pages/popover/popover';
import { PushMessagesPage } from './../pages/push-messages/push-messages';
import { InfoPage } from './../pages/info/info';
import { QuestionDetailPage } from './../pages/question-detail/question-detail';
import { MintPage } from '../pages/mint/mint';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LoginPage,
    LogoutPage,
    QuestionsPage,
    AppointmentsPage,
    ContactsPage,
    FeedbackPage,
    SelectModulePage,
    SettingsPage,
    QuestionDetailPage,
    ImpressumPage,
    DisagreeTosPage,
    MintPage,
    InfoPage,
    PopoverPage,
    PushMessagesPage
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ComponentsModule,
    CalendarModule,
    IonicModule.forRoot(MyApp, {
      backButtonText: ' ',
    }),
    IonicStorageModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (HttpLoaderFactory),
        deps: [HttpClient]
      }
    }),
    CacheModule.forRoot({ keyPrefix: 'myAppCache-' })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    LoginPage,
    LogoutPage,
    QuestionsPage,
    AppointmentsPage,
    ContactsPage,
    FeedbackPage,
    SelectModulePage,
    SettingsPage,
    QuestionDetailPage,
    ImpressumPage,
    DisagreeTosPage,
    MintPage,
    InfoPage,
    PopoverPage,
    PushMessagesPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Network,
    ConnectionProvider,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    ConnectionProvider,
    EventProvider,
    LocalNotifications,
    UPLoginProvider,
    QuestionProvider,
    PhotoViewer,
    File,
    InAppBrowser,
    Push,
    PushProvider,
    Keyboard
  ]
})
export class AppModule {}
