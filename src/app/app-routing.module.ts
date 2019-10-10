import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadChildren: './pages/home/home.module#HomePageModule' },
  { path: 'appointments', loadChildren: './pages/appointments/appointments.module#AppointmentsPageModule' },
  { path: 'contacts', loadChildren: './pages/contacts/contacts.module#ContactsPageModule' },
  { path: 'feedback', loadChildren: './pages/feedback/feedback.module#FeedbackPageModule' },
  { path: 'login', loadChildren: './pages/login/login.module#LoginPageModule' },
  { path: 'mint', loadChildren: './pages/mint/mint.module#MintPageModule' },
  { path: 'push-messages', loadChildren: './pages/push-messages/push-messages.module#PushMessagesPageModule' },
  { path: 'questions', loadChildren: './pages/questions/questions.module#QuestionsPageModule' },
  { path: 'select-module', loadChildren: './pages/select-module/select-module.module#SelectModulePageModule' },
  { path: 'settings', loadChildren: './pages/settings/settings.module#SettingsPageModule' },
  { path: 'info', loadChildren: './pages/info/info.module#InfoPageModule' },
  { path: 'impressum', loadChildren: './pages/impressum/impressum.module#ImpressumPageModule' },
  { path: 'legal-notice', loadChildren: './pages/legal-notice/legal-notice.module#LegalNoticePageModule' },
  { path: 'privacy-policy', loadChildren: './pages/privacy-policy/privacy-policy.module#PrivacyPolicyPageModule' },
  { path: 'terms-of-service', loadChildren: './pages/terms-of-service/terms-of-service.module#TermsOfServicePageModule' },
  { path: 'logout', loadChildren: './pages/logout/logout.module#LogoutPageModule' },
  { path: 'popover', loadChildren: './pages/popover/popover.module#PopoverPageModule' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
