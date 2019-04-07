import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomerService } from '../services/customer/customer.service';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.scss']
})
export class CustomerComponent implements OnInit {
  mode: string;
  message: string;

  submittedAdd: boolean;
  submittedDelete: boolean;
  submittedGet: boolean;
  submittedUpdate: boolean;


  success: boolean;
  messageForm: any;
  errors: string;

  form: FormGroup;
  deleteForm: FormGroup;
  findForm: FormGroup;
  updateForm: FormGroup;

  updateCustomerForm: boolean;

  dniUpdateInContext: string;

  messageFormDeleteCustomer: any;


  constructor(private formBuilder: FormBuilder, private formBuilderUpdate: FormBuilder, private formBuilderDelete: FormBuilder, private formBuilderFind: FormBuilder, private customerService: CustomerService) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      address: ['', Validators.required],
      //emailAddress: ['', Validators.required],
      dni: ['', Validators.required],
      phone: ['', Validators.required]
    });
    this.deleteForm = this.formBuilderDelete.group({
      customerId: ['', Validators.required],
    });
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
  }

  private buildRequestDataAddCustomer() {
    var formObj = this.form.getRawValue();
    var requestData = {
      customer_info : {
        first_name : formObj.firstName,
        last_name : formObj.lastName,
        current_address : formObj.address
        //email_address = formObj.emailAddress;
      },
      dni : formObj.dni,
      phone :formObj.phone
    };
  //  requestData.customer_info = {};
    return requestData;
  }

  private buildRequestDataUpdateCustomer() {
    var formObjUpdate = this.updateForm.getRawValue();
    var requestData = {
      customer_info : {
        first_name : formObjUpdate.firstNameUpdate,
        last_name : formObjUpdate.lastNameUpdate,
        current_address : formObjUpdate.addressUpdate
        //email_address = formObj.emailAddress;
      },
      dni : formObjUpdate.dniUpdate,
      phone :formObjUpdate.phoneUpdate
    };
  //  requestData.customer_info = {};
    return requestData;
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
        this.errors = error;
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
      },
      error => {
        this.errors = error;
      },
      () => {
        // No errors, route to new page
      }
    );
  }

  private deleteCustomer(){
    let formObj = this.deleteForm.getRawValue();
    let id = formObj.customerId;

    this.customerService.removeCustomer(id).subscribe(result => {
        console.log(result);
        this.deleteForm.reset();
        this.mode = null;
        this.message = 'deletecustomer';
        window.alert(result);
      },
      error => {
        this.errors = error;
      },
      () => {
        // No errors, route to new page
      }
    );
  }

  private createCustomer(){
    let data = this.buildRequestDataAddCustomer();

    this.customerService.createCustomer(data).subscribe(result => {
        console.log(result);
        this.form.reset();
        this.mode = null;
        this.message = 'addcustomer';
      },
      error => {
        this.errors = error;
      },
      () => {
        // No errors, route to new page
      }
    );
  }

}
