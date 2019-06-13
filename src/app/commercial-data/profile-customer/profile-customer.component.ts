import {Component,Inject,Input,ViewChild} from '@angular/core';
import {CustomerService} from '../../services/customer/customer.service';
import {MAT_DIALOG_DATA,MatDialogRef,MatRadioGroup} from '@angular/material';

@Component({
  selector: 'app-profile-customer',
  templateUrl: './profile-customer.component.html',
  styleUrls: ['./profile-customer.component.scss']
})

export class ProfileCustomerComponent {

  dni: string;
  errors: string;
  investment: string = 'no';
  derivative: string = 'no';
  income: string = 'no';
  insurance: string = 'no';
  loan: string = 'no';
  accounts: any;

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

  @Input()
  required: Boolean;

  constructor(
    private dialogRef: MatDialogRef<ProfileCustomerComponent>,
    @Inject(MAT_DIALOG_DATA) data,private customerService: CustomerService) {
    this.dni = data.dni;
  }

  public profileCustomer() {
    let requestData = this.buildRequestDataProfileCustomer();

    this.customerService.setProfileToCustomer(this.dni,requestData).subscribe(result => {
        console.log(result);
        this.dialogRef.close({refresh: true});
      },
      error => {
        this.errors = error;
      }
    );
  }

  private buildRequestDataProfileCustomer() {
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
}

