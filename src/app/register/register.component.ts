import {Component,OnInit} from '@angular/core';
import { AuthenticationService, TokenPayload } from '../authentication/authentication.service';
import { Router } from '@angular/router';
import {MatSnackBar} from '@angular/material';
import {FormGroup} from '@angular/forms';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit{
  credentials: TokenPayload = {
    email: '',
    name: '',
    password: '',
    role: ''
  };
  selectRankExport = 'Advisor';
  registerForm : FormGroup;

  constructor(private snackBar: MatSnackBar, private auth: AuthenticationService) {}

  register() {
    if(this.credentials.name && this.credentials.password && this.credentials.email){
      this.credentials.role = this.selectRankExport;
      this.auth.register(this.credentials).subscribe(() => {
        this.openSnackBar(this.credentials.role + ' was created successfully.');
      }, () => {
        this.openSnackBar('User insertion was wrong.');
      });
    }else{
      this.openSnackBar('Kindly enter user data.');

    }


  }

  private openSnackBar(message: string) {
    this.snackBar.open(message,'OK',{
      duration: 1500,
      verticalPosition: 'top',
      panelClass: ['snackbar-style-home']
    });
  }

  setValue(){
    console.log(this.selectRankExport)
  }

  ngOnInit(): void {
  }
}
