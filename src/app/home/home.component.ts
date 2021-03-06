import {Component,OnInit} from '@angular/core';
import {FormBuilder,FormGroup,Validators} from '@angular/forms';
import {CustomerService} from '../services/customer/customer.service';
import {AdvisorService} from '../services/advisor/advisor.service';

import {AccountContentTemplate} from './popup_create_account/account_content_template.component';

import {animate,state,style,transition,trigger} from '@angular/animations';
import {AuthenticationService,UserDetails} from '../authentication/authentication.service';
import {MatDialog,MatDialogConfig,MatSnackBar} from '@angular/material';
import {Observable} from 'rxjs';
import {MovementContentTemplateComponent} from './movement-content-template/movement-content-template.component';

enum DerivativeStatus {
  NOT_STARTED = 'NOT_STARTED',
  NOT_COMPLETED = 'NOT_COMPLETED',
  COMPLETED = 'COMPLETED'
}

const MAX_PRODUCTS: number = 5;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: [
    trigger('detailExpand',[
      state('collapsed',style({height: '0px',minHeight: '0',display: 'none'})),
      state('expanded',style({height: '*'})),
      transition('expanded <=> collapsed',animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class HomeComponent implements OnInit {

  data: Observable<DataModel> = null;
  dataRelations: Observable<RelationsModel> = null;
  dataCommercialInformation: Observable<CommercialInformationModel> = null;

  columnsToDisplay = ['id','iban','account','balance'];
  dataSourceAccounts: Array<Account> = [];
  expandedAccount: Account | null;

  findForm: FormGroup;

  customerDni: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;

  showCommercialLoading: Boolean = false;
  showRelationsLoading: Boolean = false;
  showGraphicLoading: Boolean = false;
  showTableLoading: Boolean = false;

  showCustomerNameLoading: Boolean = false;

  tableIsFilled: boolean = false;
  errors: string;
  hasAccounts: boolean = false;

  isAdmin: boolean = false;
  details: UserDetails;
  advisorIdFromCustomerinContext: string;
  private advisorEmailFromCustomerInContext: string;

  constructor(private authenticationService: AuthenticationService,
              private snackBar: MatSnackBar,
              public account: MatDialog,
              public movementDialog: MatDialog,
              private formBuilderFind: FormBuilder,
              private customerService: CustomerService,
              private advisorService: AdvisorService) {
  }

  ngOnInit() {
    this.findForm = this.formBuilderFind.group({
      customerId: ['',Validators.required],
    });

    this.authenticationService.profile().subscribe(user => {
      this.details = user.authorizedData;
    },(err) => {
      console.error(err);
    });


    this.isAdmin = this.authenticationService.isAdmin();
  }

  public openDialogMovements() {

    this.customerService.getAccountsFromCustomer(this.customerDni).subscribe((result: any) => {

        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.width = '600px';
        dialogConfig.data = {
          dni: this.customerDni,
          accounts: result
        };
        const dialogRef = this.movementDialog.open(MovementContentTemplateComponent,dialogConfig);

        dialogRef.afterClosed().subscribe(result => {

          console.log(`Dialog result: ${result}`);
          this.refreshView(result);
        });
      },
      error => {
        this.errors = error;
      });

  }

  public openDialogAccounts() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '600px';

    dialogConfig.data = {
      dni: this.customerDni
    };

    const dialogRef = this.account.open(AccountContentTemplate,dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      this.refreshView(result);
    });
  }

  public refreshView(result) {
    if (result.refresh) {
      this.tableIsFilled = false;
      this.customerService.getAccountsFromCustomer(this.customerDni).subscribe((result: any) => {
          this.fillTableAndChartWithAccounts(result);
          this.renderExpensesWidget();
        },
        error => {
          this.errors = error;
        });
    }
  }

  public fillTableAndChartWithAccounts(accounts) {

    this.dataSourceAccounts = [];

    this.tableIsFilled = false;
    if (accounts.length === 0) {
      this.hasAccounts = false;
    }
    accounts.forEach((account,i) => {
      this.hasAccounts = true;

      this.dataSourceAccounts.push({
        position: i + 1,
        id: i + 1,
        iban: account.iban,
        account: account.account_name.toUpperCase(),
        balance: account.total_amount + ' €',
        description: account.movements

      });
    });

    this.tableIsFilled = true;

  }

  private renderExpensesWidget() {
    this.data = this.customerService.getMovementsByAccount(this.customerDni);
  }

  private renderRelationsWidget(advisorId,groups) {

    if (groups) {
      if (advisorId) {
        this.advisorService.getAdvisor(advisorId).subscribe((result: any) => {

            this.parseInformationToRelationsWidget(result.email,groups);
          },
          error => {
            this.errors = error;
          });
      } else {
        this.parseInformationToRelationsWidget('NOT INFORMED',groups);
      }
    }
  }

  public findCustomer() {
    let formObj = this.findForm.getRawValue();
    let id = formObj.customerId;

    if (id !== '') {
      if (id !== this.customerDni) {
        this.showLoadingInWidgets(true);
        this.customerService.getCustomer(id).subscribe((result: any) => {
            if (result) {
              this.advisorIdFromCustomerinContext = result.advisor;
              this.populateInfo(result);
              this.renderExpensesWidget();
              this.renderRelationsWidget(result.advisor,[result.investment_products.familiar_group,result.investment_products.economical_group]);
              this.renderCommercialInformationWidget(result);

            } else {
              this.openSnackBar('Customer not found');
              this.findForm.reset();
            }
            this.showLoadingInWidgets(false);

          },
          error => {
            this.errors = error;
            this.openSnackBar('Customer not found');
            this.findForm.reset();
            this.showLoadingInWidgets(false);

          });
      }
    } else {
      this.openSnackBar('Introduce a valid DNI');
    }
  }

  private showLoadingInWidgets(toggle) {
    this.showCommercialLoading = toggle;
    this.showRelationsLoading = toggle;
    this.showGraphicLoading = toggle;
    this.showCustomerNameLoading = toggle;
    this.showTableLoading = toggle;

  }

  private populateInfo(result) {
    this.customerDni = result.dni;
    this.customerName = result.customer_info.first_name + ' ' + result.customer_info.last_name;
    this.customerPhone = result.phone;
    this.customerAddress = result.customer_info.current_address;

    this.fillTableAndChartWithAccounts(result.accounts);
  }

  public getProductsInfo(products) {
    let qtyProductsProfiled = [
      products.product1,
      products.product2,
      products.product3,
      products.product4,
      products.product5].filter(v => v).length;

    let derivativeProductsStatus = qtyProductsProfiled === MAX_PRODUCTS ? DerivativeStatus.COMPLETED : DerivativeStatus.NOT_COMPLETED;

    if (qtyProductsProfiled === 0) {
      derivativeProductsStatus = DerivativeStatus.NOT_STARTED;
    }
    return [derivativeProductsStatus,qtyProductsProfiled.toString() + '/' + MAX_PRODUCTS.toString()];
  }

  public processDateToFront(date: any) {
    return date.replace(/T/,' ').replace(/\..+/,'');
  }

  private openSnackBar(message: string) {
    this.snackBar.open(message,'OK',{
      duration: 1500,
      verticalPosition: 'top',
      panelClass: ['snackbar-style-home']
    });
  }

  private renderCommercialInformationWidget(result: any) {
    this.dataCommercialInformation = new Observable(observer => {
      observer.next(this.dataRefreshed(result));
      observer.complete();
    });
  }

  private dataRefreshed(result: any) {
    return {
      dni: this.customerDni,
      advisor: this.advisorIdFromCustomerinContext,
      customerRevisionDate: this.processDateToFront(result.customer_info.last_modification_date),
      customerRiskLaundering: result.customer_info.risk_money_laundering.toString().toUpperCase(),
      customerOffice: result.assigned_office,
      derivatives: this.getProductsInfo(result.derivative_products)
    };
  }

  private parseInformationToRelationsWidget(advisor,groups) {

    this.advisorEmailFromCustomerInContext = advisor;
    this.dataRelations = new Observable(observer => {
      observer.next({
        dni: this.customerDni,
        advisor_name: advisor,
        advisor_id: this.advisorIdFromCustomerinContext,
        familiar_group: {tasks: groups[0].tasks,campaigns: groups[0].campaigns,documents: groups[0].documents},
        economical_group: {tasks: groups[1].tasks,campaigns: groups[1].campaigns,documents: groups[1].documents}
      });
      observer.complete();
    });
  }

  isButtonVisible() {
    if (!this.details) {
      return false;
    }
    return this.isAdmin || (this.details._id === this.advisorIdFromCustomerinContext);
  }
}

export interface DataModel {
  account_name: string;
  total_movements: number;
}

export interface RelationsModel {
  dni: string;
  advisor_name: string;
  advisor_id: string;
  familiar_group: object;
  economical_group: object;
}

export interface CommercialInformationModel {
  dni: string;
  advisor: string;
  customerRevisionDate: string;
  customerRiskLaundering: string;
  customerOffice: string;
  derivatives: any;
}

export interface Account {
  position: number;
  id: any;
  iban: string;
  account: string;
  balance: string;
  description: string;
}
