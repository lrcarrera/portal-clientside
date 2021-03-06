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

@Component({
  selector: 'account_content_template',
  templateUrl: 'account_content_template.html',
})

export class AccountContentTemplate {

  ibanControl = new FormControl('',[
    Validators.required,
    Validators.minLength(24)
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

  constructor(
    private dialogRef: MatDialogRef<AccountContentTemplate>,
    @Inject(MAT_DIALOG_DATA) data,private customerService: CustomerService) {
    this.dni = data.dni;
  }


  public storeAccountToCustomerInContext() {
    let data = this.buildRequestDataAddAccount();
    this.customerService.addAccountToCustomer(this.dni,data).subscribe(result => {
        console.log(result);
        this.dialogRef.close({refresh: true});
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
  }
}
