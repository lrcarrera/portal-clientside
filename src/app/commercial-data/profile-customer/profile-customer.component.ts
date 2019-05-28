import {Component,Inject,Input,OnInit,ViewChild} from '@angular/core';

import {FormControl,FormGroupDirective,NgForm,Validators} from '@angular/forms';
import {CustomerService} from '../../services/customer/customer.service';
import {ErrorStateMatcher} from '@angular/material/core';
import {MAT_DIALOG_DATA,MatDialogRef,MatRadioButton,MatRadioGroup} from '@angular/material';


export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null,form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}
@Component({
  selector: 'app-profile-customer',
  templateUrl: './profile-customer.component.html',
  styleUrls: ['./profile-customer.component.scss']
})
export class ProfileCustomerComponent {

  accountControl = new FormControl('',[
    Validators.required,
  ]);

  descriptionControl = new FormControl('',[
    Validators.required,
  ]);

  amountControl = new FormControl('',[
    Validators.required,
  ]);

  matcher = new MyErrorStateMatcher();

  dni: string;
  errors: string;

  investment: string = 'no';
  derivative: string = 'no';
  income: string = 'no';
  insurance: string = 'no';
  loan: string = 'no';

  accounts: any;
  accountsToComboBox: any = [];
  typeOfMovement: string;
  investmentyes: any;
  investmentno: any;

  @ViewChild('investment')
  investmentRB: MatRadioGroup;


  constructor(
    private dialogRef: MatDialogRef<ProfileCustomerComponent>,
    @Inject(MAT_DIALOG_DATA) data,private customerService: CustomerService) {
    //this.dni = data.dni;
    //this.accounts = data.accounts;
    //this.populateComboWithAccountDescriptions();
  }

  private populateComboWithAccountDescriptions() {
    this.accounts.forEach((account: any) => {
      this.accountsToComboBox.push(account);
    });
  }

  public profileCustomer(){
    let requestData = this.buildRequestDataProfileCustomer();
    console.log(requestData);
  }

  private buildRequestDataProfileCustomer(){
    return {
      profile: {
        product1: this.investment === 'yes',
        product2: this.derivative === 'yes',
        product3: this.income === 'yes',
        product4: this.insurance === 'yes',
        product5: this.loan === 'yes',
      },
      customer_dni: "XXX"
    };
  }


  public storeMovementInAccount() {

    let movementData = this.buildRequestDataAddMovement();

    this.customerService.addMovementToAccount(this.dni,movementData).subscribe(result => {
        console.log(result);
        this.dialogRef.close({refresh: true});
      },
      error => {
        this.errors = error;
      }
    );
  }

  /*
    public storeAccountToCustomerInContext() {


      let data = this.buildRequestDataAddAccount();

      this.customerService.addAccountToCustomer(this.dni, data).subscribe(result => {
          console.log(result);
          this.dialogRef.close({ refresh : true});
        },
        error => {
          this.errors = error;
        }
      );
    }


    private buildRequestDataAddAccount() {
      return {
        iban: this.ibanControl.value,
        total_amount: this.amountControl.value,
        account_name: this.descriptionControl.value
      };
    }*/
  private buildRequestDataAddMovement() {
    let nameOfAccount = this.accountControl.value.account_name;

    let accountInCombo = this.accounts.find(function(account) {
      return account.account_name === nameOfAccount;
    });

    return {
      movement: {
        amount: this.amountControl.value,
        description: this.descriptionControl.value
      },
      account_iban: accountInCombo.iban
    };
  }
}

