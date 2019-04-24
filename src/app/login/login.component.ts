import { Component } from '@angular/core';
import { AuthenticationService, TokenPayload } from '../authentication/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  credentials: TokenPayload = {
    name:'',
    email: '',
    password: ''
  };
  loggingInProgress: Boolean = false;

  constructor(private auth: AuthenticationService, private router: Router) {}


  login() {
    this.loggingInProgress = true;
    this.auth.login(this.credentials).subscribe(() => {
      this.loggingInProgress = false;
      this.router.navigateByUrl('/');
    }, (err) => {
      console.error(err);
    });
  }
}
