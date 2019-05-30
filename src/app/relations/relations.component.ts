import {Component,Input,OnChanges,ViewChild,ViewEncapsulation} from '@angular/core';
import {MatDialog,MatDialogConfig} from '@angular/material';
import {CustomerService} from '../services/customer/customer.service';
import {AuthenticationService,UserDetails} from '../authentication/authentication.service';
import {ProfileCustomerComponent} from '../commercial-data/profile-customer/profile-customer.component';
import {TaskCreatorComponent} from './task-creator/task-creator.component';


export interface RelationsModel {
  dni: string;
  advisor_id: string;
  advisor_name: string;
  familiar_group: any;
  economical_group: any;
}


@Component({
  selector: 'app-relations',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './relations.component.html',
  styleUrls: ['./relations.component.scss']
})
export class RelationsComponent implements OnChanges {

  @ViewChild('relations')


  @Input()
  dataRelations: RelationsModel;
  showRelationsWidget: Boolean = true;
  familiarTotal: Number = 0;
  economicalTotal: Number = 0;

  details: UserDetails;
  hasFamiliarActivity: boolean = false;
  hasEconomicalActivity: boolean = false;

  constructor(
    public createTask: MatDialog,
    private customerService: CustomerService,
    private authenticationService: AuthenticationService) {
  }


  ngOnChanges(): void {
    if (!this.dataRelations) {
      this.showRelationsWidget = false;
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

  onResize() {
    if (!this.dataRelations) {
      this.showRelationsWidget = false;
      return;
    }
    this.initWidget();
    this.showWidget();
  }

  private showWidget(): void {
    this.familiarTotal = Object.keys(this.dataRelations.familiar_group)
      .reduce((sum,key) => sum + parseFloat(this.dataRelations.familiar_group[key] || 0),0);

    this.economicalTotal = Object.keys(this.dataRelations.economical_group)
      .reduce((sum,key) => sum + parseFloat(this.dataRelations.economical_group[key] || 0),0);

    if(this.familiarTotal > 0) {
      this.hasFamiliarActivity = true;
    }
    if(this.economicalTotal > 0) {
      this.hasEconomicalActivity = true;
    }


  }

  createTaskByCustomer() {

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '600px';

    dialogConfig.data = {
      dni: this.dataRelations.dni
    };


    const dialogRef = this.createTask.open(TaskCreatorComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {

      console.log(`Dialog result: ${result}`);
      //this.refreshView(result);
      this.refreshWidget();

    });
  }

  private refreshWidget(){
//TODO: populate info on refresh
    this.customerService.getCustomer(this.dataRelations.dni).subscribe((result: any) => {
        //this.dataCommercialInformation.customerRevisionDate = this.processDateToFront(result.customer_info.last_modification_date);
        //this.dataCommercialInformation.customerRiskLaundering = result.customer_info.risk_money_laundering.toString().toUpperCase();
        // customerOffice: result.assigned_office,
        //this.dataCommercialInformation.derivatives =  this.getProductsInfo(result.derivative_products);

      if(result){

        this.dataRelations.familiar_group = result.investment_products.familiar_group;
        this.dataRelations.economical_group = result.investment_products.economical_group;
        this.showWidget();
      }
       // this.renderRelationsWidget([result.investment_products.familiar_group,result.investment_products.economical_group]);


        //dni: this.customerDni,
          //advisor_name: advisor,
          //advisor_id: this.advisorIdFromCustomerinContext,
      //    familiar_group: {tasks: groups[0].tasks,campaigns: groups[0].campaigns,documents: groups[0].documents},
      //  economical_group: {tasks: groups[1].tasks,campaigns: groups[1].campaigns,documents: groups[1].documents}
      },
      error => {
        //this.errors = error;
      });
  }

  isButtonVisible() {
    return this.authenticationService.isAdmin() || (this.details._id === this.dataRelations.advisor_id);
  }
}
