import { NgModule } from "@angular/core";
import { PreloadAllModules, RouterModule, Routes } from "@angular/router";

const routes: Routes = [
  { path: "", redirectTo: "home", pathMatch: "full" },
  {
    path: "home",
    loadChildren: () =>
      import("./pages/home/home.module").then((m) => m.HomePageModule),
  },
  {
    path: "appointments",
    loadChildren: () =>
      import("./pages/appointments/appointments.module").then(
        (m) => m.AppointmentsPageModule
      ),
  },
  {
    path: "contacts",
    loadChildren: () =>
      import("./pages/contacts/contacts.module").then(
        (m) => m.ContactsPageModule
      ),
  },
  {
    path: "feedback",
    loadChildren: () =>
      import("./pages/feedback/feedback.module").then(
        (m) => m.FeedbackPageModule
      ),
  },
  {
    path: "login",
    loadChildren: () =>
      import("./pages/login/login.module").then((m) => m.LoginPageModule),
  },
  {
    path: "push-messages",
    loadChildren: () =>
      import("./pages/push-messages/push-messages.module").then(
        (m) => m.PushMessagesPageModule
      ),
  },
  {
    path: "questions",
    loadChildren: () =>
      import("./pages/questions/questions.module").then(
        (m) => m.QuestionsPageModule
      ),
  },
  {
    path: "select-module",
    loadChildren: () =>
      import("./pages/select-module/select-module.module").then(
        (m) => m.SelectModulePageModule
      ),
  },
  {
    path: "settings",
    loadChildren: () =>
      import("./pages/settings/settings.module").then(
        (m) => m.SettingsPageModule
      ),
  },
  {
    path: "info",
    loadChildren: () =>
      import("./pages/info/info.module").then((m) => m.InfoPageModule),
  },
  {
    path: "impressum",
    loadChildren: () =>
      import("./pages/impressum/impressum.module").then(
        (m) => m.ImpressumPageModule
      ),
  },
  {
    path: "legal-notice",
    loadChildren: () =>
      import("./pages/legal-notice/legal-notice.module").then(
        (m) => m.LegalNoticePageModule
      ),
  },
  {
    path: "privacy-policy",
    loadChildren: () =>
      import("./pages/privacy-policy/privacy-policy.module").then(
        (m) => m.PrivacyPolicyPageModule
      ),
  },
  {
    path: "terms-of-service",
    loadChildren: () =>
      import("./pages/terms-of-service/terms-of-service.module").then(
        (m) => m.TermsOfServicePageModule
      ),
  },
  {
    path: "logout",
    loadChildren: () =>
      import("./pages/logout/logout.module").then((m) => m.LogoutPageModule),
  },
  {
    path: "popover",
    loadChildren: () =>
      import("./pages/popover/popover.module").then((m) => m.PopoverPageModule),
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
