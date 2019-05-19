import { Component } from '@angular/core';
import { AuthenticationService, TokenPayload } from '../authentication/authentication.service';
import { Router } from '@angular/router';
import {MatDialog,MatDialogConfig,MatSnackBar} from '@angular/material';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  credentials: TokenPayload = {
    name:'',
    email: '',
    password: '',
    role: ''
  };
  loggingInProgress: Boolean = false;

  constructor(private snackBar: MatSnackBar, private auth: AuthenticationService, private router: Router) {}


  login() {
    this.loggingInProgress = true;
    this.auth.login(this.credentials).subscribe(() => {
      this.loggingInProgress = false;
      this.router.navigateByUrl('/');
    }, (err) => {
      this.loggingInProgress = false;
      this.openSnackBar('Sorry, account not found');
      this.router.navigateByUrl('/login');
      console.error(err);
    });
  }

  private openSnackBar(message: string) {
    this.snackBar.open(message,'OK',{
      duration: 1500,
      verticalPosition: 'top',
      panelClass: ['snackbar-style-home']
    });
  }
}

