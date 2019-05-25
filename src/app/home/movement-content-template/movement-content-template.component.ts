import {Component,Inject} from '@angular/core';
import {FormControl,FormGroupDirective,NgForm,Validators} from '@angular/forms';
import {CustomerService} from '../../services/customer/customer.service';
import {ErrorStateMatcher} from '@angular/material/core';

import {MAT_DIALOG_DATA,MatDialogRef} from '@angular/material';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null,form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

export interface Movement {
  iban: string;
  description: string;
  amount: string;
}

@Component({
  selector: 'movement-content-template',
  templateUrl: 'movement-content-template.html',
})
export class MovementContentTemplateComponent {

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


  accounts: any;
  accountsToComboBox: any = [];
  typeOfMovement: string;

  constructor(
    private dialogRef: MatDialogRef<MovementContentTemplateComponent>,
    @Inject(MAT_DIALOG_DATA) data,private customerService: CustomerService) {
    this.dni = data.dni;
    this.accounts = data.accounts;
    this.populateComboWithAccountDescriptions();
  }

  private populateComboWithAccountDescriptions() {
    this.accounts.forEach((account: any) => {
      this.accountsToComboBox.push(account);
    });
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

