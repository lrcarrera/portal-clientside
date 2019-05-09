import {Component,Input,OnChanges,ViewChild,ViewEncapsulation} from '@angular/core';
import {RelationsModel} from '../relations/relations.component';

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

  constructor() {
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
}
