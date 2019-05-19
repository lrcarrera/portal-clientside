import { Component } from '@angular/core';
import { AuthenticationService, TokenPayload } from '../authentication/authentication.service';
import { Router } from '@angular/router';
import {FormBuilder,FormGroup} from '@angular/forms';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  credentials: TokenPayload = {
    email: '',
    name: '',
    password: '',
    role: ''
  };
  selectRankExport = 'Advisor';

  constructor(private auth: AuthenticationService, private router: Router) {}

  register() {

    this.credentials.role = this.selectRankExport;
    this.auth.register(this.credentials).subscribe(() => {
      this.router.navigateByUrl('/profile');
      console.log("entro done");
    }, (err) => {
      console.error(err);
    });
  }

  setValue(){
    console.log(this.selectRankExport)
  }
}
