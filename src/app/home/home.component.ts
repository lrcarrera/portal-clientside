import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomerService } from '../services/customer/customer.service';
import {AccountContentTemplate} from './popup_create_account/account_content_template.component';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {AuthenticationService, UserDetails} from '../authentication/authentication.service';
import { MatDialog , MatDialogConfig , MatSnackBar } from "@angular/material";


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

enum DerivativeStatus {
  NOT_STARTED = "NOT_STARTED",
  NOT_COMPLETED = "NOT_COMPLETED",
  COMPLETED = "COMPLETED"
}

const MAX_PRODUCTS: number = 5;

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

  findForm: FormGroup;

  customerDni: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  customerRevisionDate: string = '-';
  customerRiskLaundering: string = '-';
  customerOffice: string = '-';
  customerDerivativeStatus: string = DerivativeStatus.NOT_STARTED;
  customerProductsQty: string = '-';

  showCommercialLoading: Boolean = false;
  showCustomerNameLoading: Boolean = false;

  tableIsFilled: boolean = false;
  errors: string;
  hasAccounts: boolean = false;

  details: UserDetails;

  constructor(private authenticationService: AuthenticationService,
              private snackBar: MatSnackBar,
              public account: MatDialog,
              private formBuilderFind: FormBuilder,
              private customerService: CustomerService) { }

  ngOnInit(){
    this.findForm = this.formBuilderFind.group({
      customerId: ['', Validators.required],
    });

    this.authenticationService.profile().subscribe(user => {
      this.details = user.authorizedData;
    }, (err) => {
      console.error(err);
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
        amount: account.total_amount + " €",
        description: account.movements

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
        this.showCommercialLoading = true;
        this.showCustomerNameLoading = true;
        this.customerService.getCustomer(id).subscribe((result:any) => {
          this.populateInfo(result);
          this.showCommercialLoading = false;
          this.showCustomerNameLoading = false;
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
    if (!result) {
      this.openSnackBar('Customer not found');
      this.resetCustomerInformation();
    } else {
      this.customerDni = result.dni;
      this.customerName = result.customer_info.first_name + ' ' + result.customer_info.last_name;
      this.customerPhone = result.phone;
      this.customerAddress = result.customer_info.current_address;
      this.customerRevisionDate = HomeComponent.processDateToFront(result.customer_info.last_modification_date);
      this.customerRiskLaundering = result.customer_info.risk_money_laundering.toString().toUpperCase();
      this.customerOffice = result.assigned_office;
      [this.customerDerivativeStatus, this.customerProductsQty] = HomeComponent.getProductsInfo(result.derivative_products);

      this.fillTableWithAccounts(result.accounts);

    }
  }

  private resetCustomerInformation(){
    this.findForm.reset();
    this.customerDni = '';
    this.customerName = '';
    this.customerPhone = '';
    this.customerAddress = '';
    this.customerRevisionDate = '-';
    this.customerRiskLaundering = '-';
    this.customerOffice = '-';
    this.customerDerivativeStatus = DerivativeStatus.NOT_STARTED;
    this.customerProductsQty = '-';

    this.hasAccounts = false;
  }

  private static getProductsInfo(products){
    let qtyProductsProfiled = [
      products.product1,
      products.product2,
      products.product3,
      products.product4,
      products.product5].filter(v => v).length;

      let derivativeProductsStatus = qtyProductsProfiled === MAX_PRODUCTS ? DerivativeStatus.COMPLETED : DerivativeStatus.NOT_COMPLETED;

      return [ derivativeProductsStatus, qtyProductsProfiled.toString() + '/' + MAX_PRODUCTS.toString() ];
    }

    private static processDateToFront(date){
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
