import {Component,Inject,OnInit} from '@angular/core';
import {FormBuilder,FormControl,FormGroup,FormGroupDirective,NgForm,Validators} from '@angular/forms';
import {CustomerService} from '../services/customer/customer.service';
import {ErrorStateMatcher} from '@angular/material/core';
import {MatDialog,MatDialogConfig,MatSnackBar} from '@angular/material';

import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {AuthenticationService,UserDetails} from '../authentication/authentication.service';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
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
  styleUrls: ['./customer.component.scss']
})
export class CustomerComponent implements OnInit {

  phoneControl = new FormControl('', [
    Validators.required,
    Validators.minLength(9)
  ]);
  homeControl = new FormControl('', [
    Validators.required,
  ]);
  dniControl = new FormControl('', [
    Validators.required,
    Validators.minLength(9)
  ]);
  firstNameControl = new FormControl('', [
    Validators.required,
  ]);
  lastNameControl = new FormControl('', [
    Validators.required,
  ]);

  exposureControl = new FormControl('', [
    Validators.required,
  ]);

  officeControl = new FormControl('', [
    Validators.required,
  ]);

  findControl = new FormControl('', [
    Validators.required,
  ]);

  matcher = new MyErrorStateMatcher();

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


  constructor(private snackBar: MatSnackBar, private authenticationService : AuthenticationService, private formBuilder: FormBuilder, private formBuilderUpdate: FormBuilder, private formBuilderDelete: FormBuilder, private formBuilderFind: FormBuilder, private customerService: CustomerService) {
  }

  ngOnInit() {
    /*this.deleteForm = this.formBuilderDelete.group({
      customerId: ['', Validators.required],
    });*/
    this.findForm = this.formBuilderFind.group({
      customerId: ['', Validators.required],
    });
    this.updateForm = this.formBuilderUpdate.group({
      firstNameUpdate: ['', Validators.required],
      lastNameUpdate: ['', Validators.required],
      addressUpdate: ['', Validators.required],
      //emailAddress: ['', Validators.required],
      dniUpdate: ['', Validators.required],
      phoneUpdate: ['', Validators.required]
    });

    this.updateCustomerForm = false;

    this.authenticationService.profile().subscribe(user => {
      this.details = user.authorizedData;
    }, (err) => {
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

  private buildRequestDataUpdateCustomer() {
    let formObjUpdate = this.updateForm.getRawValue();
    //  requestData.customer_info = {};
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
  }

  private findCustomer(){
    let formObj = this.findForm.getRawValue();
    let id = formObj.customerId;

    this.customerService.getCustomer(id).subscribe((result:any) => {
        console.log(result);
        if(result){
          /*this.firstNameUpdateValue = ;
          this.lastNameUpdateValue = ;
          this.addressUpdateValue = result.customer_info.current_address;
          this.phoneUpdateValue = result.phone;*/

          this.dniUpdateInContext = result.dni;

          this.updateForm.controls['firstNameUpdate'].setValue(result.customer_info.first_name);
          this.updateForm.controls['lastNameUpdate'].setValue(result.customer_info.last_name);
          this.updateForm.controls['dniUpdate'].setValue(result.dni);
          this.updateForm.controls['addressUpdate'].setValue(result.customer_info.current_address);
          this.updateForm.controls['phoneUpdate'].setValue(result.phone);


          this.message = 'updateCustomer';
          this.updateCustomerForm = true;
        }else{
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

  private updateCustomer(){
    let data = this.buildRequestDataUpdateCustomer();

    this.customerService.updateCustomer(this.dniUpdateInContext, data).subscribe(result => {
        console.log(result);
        /*this.form.reset();
        this.mode = null;
        this.message = 'addcustomer';*/
        this.openSnackBar('The customer was updated successfully');

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

  private deleteCustomer(){
    let id = this.findControl.value;

    this.customerService.removeCustomer(id).subscribe(result => {
        console.log(result);
       //this.deleteForm.reset();
        this.mode = null;
        this.openSnackBar('The customer was deleted successfully');

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

  private createCustomer(){
    let data = this.buildRequestDataAddCustomer();

    this.customerService.createCustomer(data).subscribe(result => {
        //console.log(result);
        //this.form.reset();
        this.openSnackBar('The customer was added successfully');

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
}
