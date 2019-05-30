import {Component,Inject,Input,NgModule,OnInit,ViewChild} from '@angular/core';

import {FormControl,FormGroupDirective,FormsModule,NgForm,Validators} from '@angular/forms';
import {CustomerService} from '../../services/customer/customer.service';
import {ErrorStateMatcher} from '@angular/material/core';
import {MAT_DIALOG_DATA,MatDialogRef,MatRadioButton,MatRadioGroup} from '@angular/material';
import {BrowserModule} from '@angular/platform-browser';


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

  insuranceControl = new FormControl('',[
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

  @ViewChild('derivative')
  derivativeRB: MatRadioGroup;

  @ViewChild('loan')
  loanRB: MatRadioGroup;

  @ViewChild('income')
  incomeRB: MatRadioGroup;

  @ViewChild('insurance')
  insuranceRB: MatRadioGroup;

  investmentControl: FormControl;
  derivativeControl: FormControl;
  loanControl: FormControl;
  incomeControl: FormControl;

  @Input()
  required: Boolean;


  constructor(
    private dialogRef: MatDialogRef<ProfileCustomerComponent>,
    @Inject(MAT_DIALOG_DATA) data,private customerService: CustomerService) {
    this.dni = data.dni;
    //this.accounts = data.accounts;
    //this.populateComboWithAccountDescriptions();
   /* this.investmentControl = new FormControl('', Validators.required);
    this.derivativeControl = new FormControl('', Validators.required);
    this.loanControl = new FormControl('', Validators.required);
    this.incomeControl = new FormControl('', Validators.required);
    this.insuranceControl = new FormControl('', Validators.required);
*/
  }

  private populateComboWithAccountDescriptions() {
    this.accounts.forEach((account: any) => {
      this.accountsToComboBox.push(account);
    });
  }

  public profileCustomer(){
    let requestData = this.buildRequestDataProfileCustomer();

    this.customerService.setProfileToCustomer(this.dni, requestData).subscribe(result => {
        console.log(result);
        this.dialogRef.close({refresh: true});
      },
      error => {
        this.errors = error;
      }
    );

    console.log(requestData);
  }

  private buildRequestDataProfileCustomer(){
    return {
      profile: {
        product1: this.investmentRB.value === 'yes',
        product2: this.derivativeRB.value === 'yes',
        product3: this.loanRB.value === 'yes',
        product4: this.incomeRB.value === 'yes',
        product5: this.insuranceRB.value === 'yes',
      }
    };

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
}

