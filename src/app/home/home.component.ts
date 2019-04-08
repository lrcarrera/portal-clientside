import { Component, OnInit } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomerService } from '../services/customer/customer.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  users: Object;
  customers: Object;
  h1Style: boolean;
  findForm: FormGroup;

  customerDni: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;

  errors: string;


  constructor(private formBuilderFind: FormBuilder, private customerService: CustomerService) { }

  ngOnInit() {
    this.findForm = this.formBuilderFind.group({
      customerId: ['', Validators.required],
    });
  }

  private findCustomerAndPopulateInfo(){
    let formObj = this.findForm.getRawValue();
    let id = formObj.customerId;

    this.customerService.getCustomer(id).subscribe((result:any) => {
        console.log(result);
        if(result){
          /*this.firstNameUpdateValue = ;
          this.lastNameUpdateValue = ;
          this.addressUpdateValue = result.customer_info.current_address;
          this.phoneUpdateValue = result.phone;*/

          this.customerDni = result.dni;
          this.customerName = result.customer_info.first_name + " " + result.customer_info.last_name;
          this.customerPhone = result.phone;
          this.customerAddress = result.customer_info.current_address;


        /*  this.updateForm.controls['firstNameUpdate'].setValue(result.customer_info.first_name);
          this.updateForm.controls['lastNameUpdate'].setValue(result.customer_info.last_name);
          this.updateForm.controls['dniUpdate'].setValue(result.dni);
          this.updateForm.controls['addressUpdate'].setValue(result.customer_info.current_address);
          this.updateForm.controls['phoneUpdate'].setValue(result.phone);
*/

          //this.message = 'updateCustomer';
          //this.updateCustomerForm = true;
        }else{
          this.findForm.reset();
          this.customerDni = "";
          this.customerName = "";
          this.customerPhone = "";
          this.customerAddress = "";
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

  /*invokePost(){
    this.customerService.postAPIData().subscribe(result => {
        console.log(result);
      }
    );

  }

  firstClick() {
    console.log('see the list!');
    this.h1Style = true;

    this.customerService.getAPIData().subscribe(result => {
        this.customers = result;
        console.log(this.customers);
      }
    );
  }*/

}
