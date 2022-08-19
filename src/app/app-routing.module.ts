import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from '../app/login/login.component';
import { RegisterComponent } from '../app/register/register.component';
import {DashboardComponent} from '../app/dashboard/dashboard.component';
import {CreateentryComponent} from '../app/createentry/createentry.component';
import {DateviewComponent} from '../app/dateview/dateview.component';
import {ProfileComponent} from '../app/profile/profile.component';
import { CalendarComponent } from './calendar/calendar.component';
import {SinglePostResolver} from '../app/single.post.resolver'
import {RedirectGuard} from '../app/RedirectGuard'

const routes: Routes = [
  { path: '', canActivate: [RedirectGuard], data: {redirectTo: '/login'}, pathMatch: 'full', component: LoginComponent },

  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'createentry', component: CreateentryComponent },
  { path: 'dateview', component: DateviewComponent },
  {path: 'profile', component: ProfileComponent},
  { path: 'calendar', component: CalendarComponent, resolve: { singlePost: SinglePostResolver}}
 

];

@NgModule({
  imports: [RouterModule.forRoot(routes,{
    paramsInheritanceStrategy: 'always'
  })],
  
  exports: [RouterModule]
})
export class AppRoutingModule { }

