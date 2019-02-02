import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';




import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { ContactComponent } from './contact/contact.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'contact', component: ContactComponent },
  {
        path: 'externalRedirect',
        resolve: {
            url: externalUrlProvider,
        },
        // We need a component here because we cannot define the route otherwise
        component: NotFoundComponent,
    },
];




@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
