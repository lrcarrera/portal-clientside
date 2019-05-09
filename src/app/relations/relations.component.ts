import {Component,Input,OnChanges,ViewChild,ViewEncapsulation} from '@angular/core';


export interface RelationsModel {
  advisor_name: string;
  familiar_group: object;
  economical_group: object;
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

  constructor() {
  }


  ngOnChanges(): void {
    if (!this.dataRelations) {
      this.showRelationsWidget = false;
      return;
    }

    this.showWidget();
  }

  onResize() {
    if (!this.dataRelations) {
      this.showRelationsWidget = false;
      return;
    }

    this.showWidget();
  }

  private showWidget(): void {
    this.familiarTotal = Object.keys(this.dataRelations.familiar_group)
      .reduce((sum,key) => sum + parseFloat(this.dataRelations.familiar_group[key] || 0),0);

    this.economicalTotal = Object.keys(this.dataRelations.economical_group)
      .reduce((sum,key) => sum + parseFloat(this.dataRelations.economical_group[key] || 0),0);

  }
}
