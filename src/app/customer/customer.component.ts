import {Component,Inject,OnInit} from '@angular/core';
import {FormBuilder,FormControl,FormGroup,FormGroupDirective,NgForm,Validators} from '@angular/forms';
import {CustomerService} from '../services/customer/customer.service';
import {ErrorStateMatcher} from '@angular/material/core';
import {MatDialog,MatDialogConfig,MatSnackBar} from '@angular/material';

import {MAT_DIALOG_DATA,MatDialogRef} from '@angular/material';
import {AuthenticationService,UserDetails} from '../authentication/authentication.service';
import {AboutComponent} from '../about/about.component';
import {Observable} from 'rxjs';
import {RelationsModel} from '../home/home.component';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null,form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

export interface Level {
  level: string;
}

export interface Office {
  name: string;
}

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.scss'],
  providers: [AboutComponent]
})
export class CustomerComponent implements OnInit {

  dataCustomerTable: Observable<boolean>;

  matcher = new MyErrorStateMatcher();

  updateCustomerFb: FormGroup;

  mode: string;
  message: string;

  errors: string;
  //deleteForm: FormGroup;
  findForm: FormGroup;
  updateForm: FormGroup;

  updateCustomerForm: boolean;

  dniUpdateInContext: string;

  messageFormDeleteCustomer: any;

  details: UserDetails;

  exposureLevels: Level[] = [
    {level: 'low'},
    {level: 'medium'},
    {level: 'high'}
  ];

  offices: Office[] = [
    {name: 'B. PRIVADA BARCELONA CENTRO'},
    {name: 'B. PRIVADA MADRID CENTRO'},
    {name: 'B. PRIVADA MADRID NORTE'},
    {name: 'B. PRIVADA VALENCIA'},
    {name: 'B. PRIVADA ZARAGOZA'},
    {name: 'B. PUBLICA BARCELONA CENTRO'},
    {name: 'B. PUBLICA MADRID CENTRO'},
    {name: 'B. PUBLICA VALENCIA'},
    {name: 'B. PUBLICA ZARAGOZA'},
  ];


  constructor(private customerTable: AboutComponent,private snackBar: MatSnackBar,private authenticationService: AuthenticationService,private formBuilder: FormBuilder,private formBuilderUpdate: FormBuilder,private formBuilderDelete: FormBuilder,private formBuilderFind: FormBuilder,private customerService: CustomerService) {
  }

  ngOnInit() {
    /*this.deleteForm = this.formBuilderDelete.group({
      customerId: ['', Validators.required],
    });*/
    this.updateCustomerFb = this.formBuilder.group({
      updateCustomerLevel: [null,Validators.required],
      updateCustomerOffice: [null,Validators.required]

    });

    this.findForm = this.formBuilderFind.group({
      customerId: ['',Validators.required],
    });
    /*this.updateForm = this.formBuilderUpdate.group({
      firstNameUpdate: ['', Validators.required],
      lastNameUpdate: ['', Validators.required],
      addressUpdate: ['', Validators.required],
      //emailAddress: ['', Validators.required],
      dniUpdate: ['', Validators.required],
      phoneUpdate: ['', Validators.required]
    });*/

    this.updateCustomerForm = false;

    this.authenticationService.profile().subscribe(user => {
      this.details = user.authorizedData;
    },(err) => {
      console.error(err);
    });
  }

  private buildRequestDataAddCustomer() {

    //let formObj = this.form.getRawValue();
    //  requestData.customer_info = {};
    return {
      customer: {
        customer_info: {
          first_name: this.firstNameControl.value,
          last_name: this.lastNameControl.value,
          current_address: this.homeControl.value,
          risk_money_laundering: this.exposureControl.value.level
          //email_address = formObj.emailAddress;
        },
        dni: this.dniControl.value,
        phone: this.phoneControl.value,
        assigned_office: this.officeControl.value.name
      },
      advisor: this.details._id
    };
  }

  /*private buildRequestDataUpdateCustomer() {
    return {
      customer_info: {
        first_name: formObjUpdate.firstNameUpdate,
        last_name: formObjUpdate.lastNameUpdate,
        current_address: formObjUpdate.addressUpdate
        //email_address = formObj.emailAddress;
      },
      dni: formObjUpdate.dniUpdate,
      phone: formObjUpdate.phoneUpdate
    };
  }*/

  private findCustomer() {
    let id = this.findToUpdateControl.value;

    this.customerService.getCustomer(id).subscribe((result: any) => {
        console.log(result);
        if (result) {
          /*this.firstNameUpdateValue = ;
          this.lastNameUpdateValue = ;
          this.addressUpdateValue = result.customer_info.current_address;
          this.phoneUpdateValue = result.phone;*/

          this.dniUpdateInContext = result.dni;
          this.firstNameControlUpdate.setValue(result.customer_info.first_name);
          this.lastNameControlUpdate.setValue(result.customer_info.last_name);
          this.dniControlUpdate.setValue(result.dni);
          this.homeControlUpdate.setValue(result.customer_info.current_address);
          this.phoneControlUpdate.setValue(result.phone);

          /*{name: result.assigned_office}*/
          //this.exposureControlUpdate.controls['category'].setValue(this.product.category.id);

          //this.exposureControlUpdate.controls['level'].setValue(this.product.category.id);

          const toSelectLevel = this.exposureLevels.find(c => c.level == result.customer_info.risk_money_laundering[0]);
          this.updateCustomerFb.get('updateCustomerLevel').setValue(toSelectLevel);

          const toSelectOffice = this.offices.find(c => c.name == result.assigned_office[0]);
          this.updateCustomerFb.get('updateCustomerOffice').setValue(toSelectOffice);

          this.findToUpdateControl.value('');
          this.message = 'updateCustomer';
          this.updateCustomerForm = true;
        } else {
          this.findForm.reset();
        }
      },
      error => {
        this.openSnackBar('The service is unavailable');
        console.log(error);
      },
      () => {
        // No errors, route to new page
      }
    );
  }

  private updateCustomer() {
    let data = this.buildRequestDataAddCustomer();

    this.customerService.updateCustomer(this.dniUpdateInContext,data).subscribe(result => {
        console.log(result);
        /*this.form.reset();
        this.mode = null;
        this.message = 'addcustomer';*/
        this.openSnackBar('The customer was updated successfully');
        this.customerTable.ngOnInit();

        this.dataCustomerTable = new Observable(observer => {
          observer.next();
          observer.complete();
        });
      },
      error => {
        this.openSnackBar('The service is unavailable');
        console.log(error);
      },
      () => {
        // No errors, route to new page
      }
    );
  }

  private deleteCustomer() {
    let id = this.findControl.value;

    this.customerService.removeCustomer(id).subscribe(result => {
        console.log(result);
        //this.deleteForm.reset();
        this.mode = null;
        this.openSnackBar('The customer was deleted successfully');
        this.dataCustomerTable = new Observable(observer => {
          observer.next();
          observer.complete();
        });
        this.findControl.setValue('');
        this.message = 'deletecustomer';
      },
      error => {
        this.openSnackBar('The service is unavailable');
        console.log(error);
      },
      () => {
        // No errors, route to new page
      }
    );
  }

  private createCustomer() {
    let data = this.buildRequestDataAddCustomer();

    this.customerService.createCustomer(data).subscribe(result => {
        //console.log(result);
        //this.form.reset();
        this.openSnackBar('The customer was added successfully');
        this.dataCustomerTable = new Observable(observer => {
          observer.next();
          observer.complete();
        });
        this.mode = null;
        this.message = 'addcustomer';
      },
      error => {

        this.openSnackBar('The service is unavailable');
        console.log(error);
      },
      () => {
        // No errors, route to new page
      }
    );
  }

  private openSnackBar(message: string) {
    this.snackBar.open(message,'OK',{
      duration: 1500,
      verticalPosition: 'top',
      panelClass: ['snackbar-style-home']
    });
  }


  phoneControlUpdate = new FormControl('',[
    Validators.required,
    Validators.minLength(9)
  ]);
  homeControlUpdate = new FormControl('',[
    Validators.required,
  ]);
  dniControlUpdate = new FormControl('',[
    Validators.required,
    Validators.minLength(9)
  ]);
  firstNameControlUpdate = new FormControl('',[
    Validators.required,
  ]);
  lastNameControlUpdate = new FormControl('',[
    Validators.required,
  ]);
  phoneControl = new FormControl('',[
    Validators.required,
    Validators.minLength(9)
  ]);
  homeControl = new FormControl('',[
    Validators.required,
  ]);
  dniControl = new FormControl('',[
    Validators.required,
    Validators.minLength(9)
  ]);
  firstNameControl = new FormControl('',[
    Validators.required,
  ]);
  lastNameControl = new FormControl('',[
    Validators.required,
  ]);

  exposureControl = new FormControl('',[
    Validators.required,
  ]);

  officeControl = new FormControl('',[
    Validators.required,
  ]);

  findControl = new FormControl('',[
    Validators.required,
  ]);

  findToUpdateControl = new FormControl('',[
    Validators.required,
  ]);
  levelExposure: any;
  stageValue: string;
}
