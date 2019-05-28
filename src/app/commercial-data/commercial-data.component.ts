import {Component,Input,OnChanges,ViewChild,ViewEncapsulation} from '@angular/core';
import {RelationsModel} from '../relations/relations.component';
import {MatDialog,MatDialogConfig} from '@angular/material';
import {AccountContentTemplate} from '../home/popup_create_account/account_content_template.component';
import {ProfileCustomerComponent} from './profile-customer/profile-customer.component';

export interface CommercialInformationModel {
  customerRevisionDate: string;
  customerRiskLaundering: string;
  customerOffice: string;
  derivatives: any;
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

  constructor(
    public profile: MatDialog) {
  }


  ngOnChanges(): void {
    if (!this.dataCommercialInformation) {
      this.showCommercialInformationWidget = false;
      return;
    }

    this.showWidget();
  }

  onResize() {
    if (!this.dataCommercialInformation) {
      this.showCommercialInformationWidget = false;
      return;
    }

    this.showWidget();
  }

  private showWidget(): void {/*
    this.familiarTotal = Object.keys(this.dataRelations.familiar_group)
      .reduce((sum,key) => sum + parseFloat(this.dataRelations.familiar_group[key] || 0),0);

    this.economicalTotal = Object.keys(this.dataRelations.economical_group)
      .reduce((sum,key) => sum + parseFloat(this.dataRelations.economical_group[key] || 0),0);
*/
  }

  openProfile() {

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '600px';

    dialogConfig.data = {
    //  dni: this.customerDni
    };


    const dialogRef = this.profile.open(ProfileCustomerComponent,dialogConfig);

    dialogRef.afterClosed().subscribe(result => {

      console.log(`Dialog result: ${result}`);
      //this.refreshView(result);

    });
  }
}
