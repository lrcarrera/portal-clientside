import {Component,Input,OnChanges,ViewChild,ViewEncapsulation} from '@angular/core';
import {RelationsModel} from '../relations/relations.component';
import {MatDialog,MatDialogConfig} from '@angular/material';
import {AccountContentTemplate} from '../home/popup_create_account/account_content_template.component';
import {ProfileCustomerComponent} from './profile-customer/profile-customer.component';
import {CustomerService} from '../services/customer/customer.service';
import {HomeComponent} from '../home/home.component';
import {AuthenticationService,UserDetails} from '../authentication/authentication.service';

export interface CommercialInformationModel {
  dni: string;
  advisor: string;
  customerRevisionDate: string;
  customerRiskLaundering: string;
  customerOffice: string;
  derivatives: any;
}

enum DerivativeStatus {
  NOT_STARTED = 'NOT_STARTED',
  NOT_COMPLETED = 'NOT_COMPLETED',
  COMPLETED = 'COMPLETED'
}

@Component({
  selector: 'app-commercial-information',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './commercial-data.component.html',
  styleUrls: ['./commercial-data.component.scss']
})
export class CommercialDataComponent implements OnChanges {

  @ViewChild('commercialinformation')


  @Input()
  dataCommercialInformation: CommercialInformationModel;
  showCommercialInformationWidget: Boolean = true;

  profiled: Boolean = false;
  details: UserDetails;
  MAX_PRODUCTS: number = 5;

  constructor(
    public profile: MatDialog,
    private customerService: CustomerService,
    private authenticationService: AuthenticationService) {
  }


  ngOnChanges(): void {
    if (!this.dataCommercialInformation) {
      this.showCommercialInformationWidget = false;
      return;
    }

    this.initWidget();
    this.showWidget();
  }

  onResize() {
    if (!this.dataCommercialInformation) {
      this.showCommercialInformationWidget = false;
      return;
    }
    this.initWidget();
    this.showWidget();
  }

  private initWidget(): void {

    this.authenticationService.profile().subscribe(user => {
      this.details = user.authorizedData;
    },(err) => {
      console.error(err);
    });

  }
  private showWidget(): void {
    if(this.dataCommercialInformation.derivatives[0] !== DerivativeStatus.NOT_STARTED ){
      this.profiled = true;
    }
  }

  public processDateToFront(date: any) {
    return date.replace(/T/,' ').replace(/\..+/,'');
  }

  public getProductsInfo(products) {
    let qtyProductsProfiled = [
      products.product1,
      products.product2,
      products.product3,
      products.product4,
      products.product5].filter(v => v).length;

    let derivativeProductsStatus = qtyProductsProfiled === this.MAX_PRODUCTS ? DerivativeStatus.COMPLETED : DerivativeStatus.NOT_COMPLETED;

    if(qtyProductsProfiled === 0) {
      derivativeProductsStatus = DerivativeStatus.NOT_STARTED;
    }
    return [derivativeProductsStatus,qtyProductsProfiled.toString() + '/' + this.MAX_PRODUCTS.toString()];
  }

  private refreshWidget(){

    this.customerService.getCustomer(this.dataCommercialInformation.dni).subscribe((result: any) => {
        this.profiled = true;
        this.dataCommercialInformation.customerRevisionDate = this.processDateToFront(result.customer_info.last_modification_date);
        this.dataCommercialInformation.customerRiskLaundering = result.customer_info.risk_money_laundering.toString().toUpperCase();
         // customerOffice: result.assigned_office,
        this.dataCommercialInformation.derivatives =  this.getProductsInfo(result.derivative_products);
      },
      error => {
        //this.errors = error;
      });
  }
  openProfile() {

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '600px';

    dialogConfig.data = {
      dni: this.dataCommercialInformation.dni
    };


    const dialogRef = this.profile.open(ProfileCustomerComponent,dialogConfig);

    dialogRef.afterClosed().subscribe(result => {

      console.log(`Dialog result: ${result}`);
      //this.refreshView(result);
      this.refreshWidget();

    });
  }

  isButtonVisible() {
    return this.authenticationService.isAdmin() || (this.details._id === this.dataCommercialInformation.advisor);
  }
}
