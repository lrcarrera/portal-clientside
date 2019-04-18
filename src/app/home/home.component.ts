import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomerService } from '../services/customer/customer.service';
import {FormControl, FormGroupDirective, NgForm } from '@angular/forms';
import {AccountContentTemplate} from './popup_create_account/account_content_template.component';
import {animate, state, style, transition, trigger} from '@angular/animations';



import { MAT_DIALOG_DATA, MatDialogRef, MatDialog , MatDialogConfig , MatDialogModule } from "@angular/material";


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

//////////////////
/*export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
  description: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {
    position: 1,
    name: 'Hydrogen',
    weight: 1.0079,
    symbol: 'H',
    description: `Hydrogen is a chemical element with symbol H and atomic number 1. With a standard
        atomic weight of 1.008, hydrogen is the lightest element on the periodic table.`
  }, {
    position: 2,
    name: 'Helium',
    weight: 4.0026,
    symbol: 'He',
    description: `Helium is a chemical element with symbol He and atomic number 2. It is a
        colorless, odorless, tasteless, non-toxic, inert, monatomic gas, the first in the noble gas
        group in the periodic table. Its boiling point is the lowest among all the elements.`
  }
];

*/

/////////////////////

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

  tableIsFilled: boolean = false;
  errors: string;


  constructor(public account: MatDialog, private formBuilderFind: FormBuilder, private customerService: CustomerService) { }

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
    });
  }

  public fillTableWithMovements(accounts){

      accounts.forEach((account, i) => {
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

  public findCustomerAndPopulateInfo(){
    let formObj = this.findForm.getRawValue();
    let id = formObj.customerId;

    this.customerService.getCustomer(id).subscribe((result:any) => {
        console.log(result);
        if(result){

          this.customerDni = result.dni;
          this.customerName = result.customer_info.first_name + " " + result.customer_info.last_name;
          this.customerPhone = result.phone;
          this.customerAddress = result.customer_info.current_address;

          this.fillTableWithMovements(result.accounts);

        }else{
          this.findForm.reset();
          this.customerDni = "";
          this.customerName = "";
          this.customerPhone = "";
          this.customerAddress = "";
        }
      },
      error => {
        this.errors = error;
      },
      () => {
        // No errors, route to new page
      }
    );
  }

}
