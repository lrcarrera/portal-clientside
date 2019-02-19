import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../authentication/authentication.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {

  appTitle: string = 'MyBankApp';
  // OR (either will work)
  //appTitle = 'myapp';

  constructor(public auth: AuthenticationService) {}

  ngOnInit() {
  }

}
