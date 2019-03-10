import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { ContactComponent } from './contact/contact.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ProfileComponent } from './profile/profile.component';
import { CustomerComponent } from './customer/customer.component';

import { AuthGuardService } from './guards/auth-guard.service';



const routes: Routes = [
  { path: '', component: HomeComponent, canActivate:
    [AuthGuardService] },
  { path: 'customer', component: CustomerComponent, canActivate:
      [AuthGuardService] },
  { path: 'about', component: AboutComponent, canActivate:
    [AuthGuardService] },
  { path: 'contact', component: ContactComponent, canActivate:
    [AuthGuardService] },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'profile', component: ProfileComponent, canActivate:
    [AuthGuardService] }
    ];



@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
