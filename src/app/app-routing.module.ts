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
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
