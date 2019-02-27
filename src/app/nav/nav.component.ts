import { Component, OnInit } from '@angular/core';
import { AuthenticationService, TokenPayload } from '../authentication/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {

  appTitle: string = 'MyBankApp';
  // OR (either will work)
  //appTitle = 'myapp';

  constructor(private auth: AuthenticationService, private router: Router) {}

  ngOnInit() {
  }

  logout() {
    this.auth.logout();/*
      this.router.navigateByUrl('/');
    }, (err) => {
      console.error(err);
    });*/
  }

  getAuth(){
    return this.auth;
  }

}
