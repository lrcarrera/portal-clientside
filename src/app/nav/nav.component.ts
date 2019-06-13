import {Component,OnInit} from '@angular/core';
import {AuthenticationService} from '../authentication/authentication.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {

  appTitle: string = 'MyBank';

  constructor(private auth: AuthenticationService) {
  }

  ngOnInit() {
  }

  logout() {
    this.auth.logout();
  }

  getAuth() {
    return this.auth;
  }

  getEmailLogged() {
    return this.auth.getUserDetails().email;
  }

}
