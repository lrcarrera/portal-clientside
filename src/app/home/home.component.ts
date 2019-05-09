import {Component,OnInit} from '@angular/core';
import {FormBuilder,FormGroup,Validators} from '@angular/forms';
import {CustomerService} from '../services/customer/customer.service';
import {AccountContentTemplate} from './popup_create_account/account_content_template.component';
import {animate,state,style,transition,trigger} from '@angular/animations';
import {AuthenticationService,UserDetails} from '../authentication/authentication.service';
import {MatDialog,MatDialogConfig,MatSnackBar} from '@angular/material';
import {HttpClient} from '@angular/common/http';
import {Observable,of} from 'rxjs';


export interface DataModel {
  account_name: string;
  total_movements: number;
}

export interface RelationsModel {
  advisor_name: string;
  familiar_group: object;
  economical_group: object;
}

export interface Movement {
  name: string;
  amount: string;
}

export interface Account {
  position: number;
  id: any;
  iban: string;
  account: string;
  balance: string;
  description: string;
  //Array<Movement>
}

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


  columnsToDisplay = ['id','iban','account','balance'];
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
  showRelationsLoading: Boolean = false;
  showGraphicLoading: Boolean = false;
  showTableLoading: Boolean = false;

  showCustomerNameLoading: Boolean = false;

  tableIsFilled: boolean = false;
  errors: string;
  hasAccounts: boolean = false;

  details: UserDetails;

  constructor(private authenticationService: AuthenticationService,
              private snackBar: MatSnackBar,
              public account: MatDialog,
              private formBuilderFind: FormBuilder,
              private customerService: CustomerService,
              private http: HttpClient) {

    //this.dataRelations = this.customerService.getRelationsByCustomer(this.customerDni);
    /*this.dataRelations = new Observable(observer => {
      observer.next({
        advisor_name: 'hola',
        familiar_group : {},
        economical_group : {}
      });
      observer.complete();
    });*/

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
  }

  public openDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    dialogConfig.data = {
      dni: this.customerDni
    };

    const dialogRef = this.account.open(AccountContentTemplate,dialogConfig);

    dialogRef.afterClosed().subscribe(result => {

      console.log(`Dialog result: ${result}`);
      this.toggleAccountsTable(result);
    });
  }

  public toggleAccountsTable(result) {
    if (result.refresh) {
      this.tableIsFilled = false;
      this.customerService.getAccountsFromCustomer(this.customerDni).subscribe((result: any) => {

          this.fillTableAndChartWithAccounts(result);

        },
        error => {
          this.errors = error;
        });
    } else {
      //  this.tableIsFilled = false;
    }
  }

  public fillTableAndChartWithAccounts(accounts) {

    this.dataSourceAccounts = [];

    if (accounts.length === 0) {
      this.hasAccounts = false;
    }

    this.createBarChartFromMovements(accounts);


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

  private createBarChartFromMovements(accounts) {

    // this.data = this.http.get<DataModel>('./assets/home_assets/data.json');

    this.data = this.customerService.getMovementsByAccount(this.customerDni);

  }

  private renderRelationsWidget(groups) {

    if (groups) {
      this.dataRelations = new Observable(observer => {
        observer.next({
          advisor_name: this.details.name,
          familiar_group: {tasks: groups[0].tasks,campaigns: groups[0].campaigns,documents: groups[0].documents},
          economical_group: {tasks: groups[1].tasks,campaigns: groups[1].campaigns,documents: groups[1].documents}
        });
        observer.complete();
      });
    }
  }

  public findCustomer() {
    let formObj = this.findForm.getRawValue();
    let id = formObj.customerId;

    if (id !== '') {
      if (id !== this.customerDni) {
        this.tableIsFilled = false;
        this.showLoadingInWidgets(true);
        this.customerService.getCustomer(id).subscribe((result: any) => {
            this.populateInfo(result);
            this.renderRelationsWidget([result.investment_products.familiar_group,result.investment_products.economical_group]);

            this.showLoadingInWidgets(false);
          },
          error => {
            this.errors = error;
            this.openSnackBar('Customer not found');
            this.resetCustomerInformation();
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
    if (!result) {
      this.openSnackBar('Customer not found');
      this.resetCustomerInformation();
      this.showLoadingInWidgets(false);


    } else {
      this.customerDni = result.dni;
      this.customerName = result.customer_info.first_name + ' ' + result.customer_info.last_name;
      this.customerPhone = result.phone;
      this.customerAddress = result.customer_info.current_address;
      this.customerRevisionDate = this.processDateToFront(result.customer_info.last_modification_date);
      this.customerRiskLaundering = result.customer_info.risk_money_laundering.toString().toUpperCase();
      this.customerOffice = result.assigned_office;
      [this.customerDerivativeStatus,this.customerProductsQty] = HomeComponent.getProductsInfo(result.derivative_products);

      this.fillTableAndChartWithAccounts(result.accounts);
    }
  }

  private resetCustomerInformation() {
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

  private static getProductsInfo(products) {
    let qtyProductsProfiled = [
      products.product1,
      products.product2,
      products.product3,
      products.product4,
      products.product5].filter(v => v).length;

    let derivativeProductsStatus = qtyProductsProfiled === MAX_PRODUCTS ? DerivativeStatus.COMPLETED : DerivativeStatus.NOT_COMPLETED;

    return [derivativeProductsStatus,qtyProductsProfiled.toString() + '/' + MAX_PRODUCTS.toString()];
  }

  public processDateToFront(date : any) {
    return date.replace(/T/,' ').replace(/\..+/,'');
  }

  private openSnackBar(message: string) {
    this.snackBar.open(message,'OK',{
      duration: 1500,
      verticalPosition: 'top',
      panelClass: ['snackbar-style-home']
    });
  }

  /*public getDateToMovement(movement_date: any) {
    let date = movement_date.split('T')[0];
    let dateTime = movement_date.split('T')[1].split('.')[0];

    return date + ' ' + dateTime;
  }*/
}
