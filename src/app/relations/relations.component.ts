import {Component,ElementRef,Input,OnChanges,SimpleChanges,ViewChild,ViewEncapsulation} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomerService } from '../services/customer/customer.service';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {AuthenticationService, UserDetails} from '../authentication/authentication.service';
import { MatDialog , MatDialogConfig , MatSnackBar } from "@angular/material";
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';


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
  dataRelations: RelationsModel[];
  showRelationsWidget: Boolean = true;


  constructor() { }


  ngOnChanges(): void {
    if (!this.dataRelations) {
      this.showRelationsWidget = false;
      return; }

    this.showWidget();
  }

  onResize() {
    if (!this.dataRelations) {
      this.showRelationsWidget = false;
      return; }

    this.showWidget();
  }
  private showWidget(): void {


  }
}
