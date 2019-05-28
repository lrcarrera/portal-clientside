import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { RootComponent } from './root/root.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavComponent } from './nav/nav.component';
import { AboutComponent } from './about/about.component';
import { ContactComponent } from './contact/contact.component';
import { HomeComponent } from './home/home.component';
import { AccountContentTemplate } from './home/popup_create_account/account_content_template.component';


import { FooterComponent } from './footer/footer.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { ProfileComponent } from './profile/profile.component';
import { CustomerComponent } from './customer/customer.component';



import { FormsModule } from '@angular/forms';

import 'hammerjs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppMaterialModule } from './app.material.module';
import { BarChartComponent } from './barchart/bar-chart.component';
import { RelationsComponent } from './relations/relations.component';
import { CommercialDataComponent } from './commercial-data/commercial-data.component';
import { MovementContentTemplateComponent } from './home/movement-content-template/movement-content-template.component';
import { ProfileCustomerComponent } from './commercial-data/profile-customer/profile-customer.component';

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    AboutComponent,
    ContactComponent,
    HomeComponent,
    AccountContentTemplate,
    FooterComponent,
    RootComponent,
    CustomerComponent,
    RegisterComponent,
    LoginComponent,
    ProfileComponent,
    BarChartComponent,
    RelationsComponent,
    CommercialDataComponent,
    MovementContentTemplateComponent,
    ProfileCustomerComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    AppMaterialModule,
    BrowserAnimationsModule
  ],
  providers: [],
  entryComponents: [AboutComponent, AccountContentTemplate, MovementContentTemplateComponent, ProfileCustomerComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
