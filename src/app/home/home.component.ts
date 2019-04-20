import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomerService } from '../services/customer/customer.service';
import {FormControl, FormGroupDirective, NgForm } from '@angular/forms';
import {AccountContentTemplate} from './popup_create_account/account_content_template.component';
import {animate, state, style, transition, trigger} from '@angular/animations';


import { MAT_DIALOG_DATA, MatDialogRef, MatDialog , MatDialogConfig , MatDialogModule , MatSnackBar, MatSnackBarConfig } from "@angular/material";


export interface Movement {
  name: string;
  amount: string;
}

export interface Account {
  position: number;
  bank: any;
  iban: string;
  name: string;
  amount: string;
  description: string;
  //Array<Movement>
}


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0', display: 'none'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class HomeComponent implements OnInit {


  columnsToDisplay = ['bank', 'iban', 'name', 'amount'];
  dataSourceAccounts: Array<Account> = [];
  expandedAccount: Account | null;


  users: Object;
  customers: Object;
  h1Style: boolean;
  findForm: FormGroup;

  customerDni: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  customerRevisionDate: string = '-';
  customerRiskLaundering: string = '-';
  customerOffice: string = '-';

  tableIsFilled: boolean = false;
  errors: string;
  hasAccounts: boolean = false;


  constructor(private snackBar: MatSnackBar, public account: MatDialog, private formBuilderFind: FormBuilder, private customerService: CustomerService) { }

  ngOnInit(){
    this.findForm = this.formBuilderFind.group({
      customerId: ['', Validators.required],
    });
  }

  public openDialog(){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    dialogConfig.data = {
      dni: this.customerDni
    };

    const dialogRef = this.account.open(AccountContentTemplate, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {

      console.log(`Dialog result: ${result}`);
      this.toggleAccountsTable(result);
    });
  }

  public toggleAccountsTable(result){
    if(result.refresh){
      this.tableIsFilled = false;
      this.customerService.getAccountsFromCustomer(this.customerDni).subscribe((result:any) => {

        this.fillTableWithAccounts(result);

      },
      error => {
        this.errors = error;
      });
    }else{
      //  this.tableIsFilled = false;
    }
  }

  public fillTableWithAccounts(accounts){

    this.dataSourceAccounts = [];

    if (accounts.length === 0) this.hasAccounts = false;

    accounts.forEach((account, i) => {
      this.hasAccounts = true;
      console.log(account);

      this.dataSourceAccounts.push({
        position: i+1,
        bank: 'test',
        iban: account.iban,
        name: account.account_name,
        amount: account.total_amount,
        description: `Helium is a chemical element with symbol He and atomic number 2. It is a
        colorless, odorless, tasteless, non-toxic, inert, monatomic gas, the first in the noble gas
        group in the periodic table. Its boiling point is the lowest among all the elements.`
      });
    });

    this.tableIsFilled = true;

  }

  public findCustomer(){
    let formObj = this.findForm.getRawValue();
    let id = formObj.customerId;

    if (id !== ""){
      if (id !== this.customerDni){
        this.tableIsFilled = false;
        this.customerService.getCustomer(id).subscribe((result:any) => {
          console.log(result);
          this.populateInfo(result);
        },
        error => {
          this.errors = error;
        });
      }
    }else{
      this.openSnackBar("Introduce a valid DNI");
    }
  }

  private populateInfo(result){
    if(result){
      this.customerDni = result.dni;
      this.customerName = result.customer_info.first_name + ' ' + result.customer_info.last_name;
      this.customerPhone = result.phone;
      this.customerAddress = result.customer_info.current_address;
      this.customerRevisionDate = this.processDateToFront(result.customer_info.last_modification_date);
      this.customerRiskLaundering = result.customer_info.risk_money_laundering.toString().toUpperCase();
      this.customerOffice = result.assigned_office;
      this.fillTableWithAccounts(result.accounts);

    }else{
      this.openSnackBar("Customer not found");
      this.findForm.reset();
      this.customerDni = '';
      this.customerName = '';
      this.customerPhone = '';
      this.customerAddress = '';
      this.customerRevisionDate = '-';
      this.customerRiskLaundering = '-';
      this.customerOffice = '-';

      this.hasAccounts = false;
    }
  }

  private processDateToFront(date){
    return date.replace(/T/, ' ').replace(/\..+/, '');
  }

  private openSnackBar(message: string) {
    this.snackBar.open(message, 'OK', {
      duration: 1500,
      verticalPosition: 'top',
      panelClass: ['snackbar-style-home']
    });
  }

}
