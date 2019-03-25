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

  submitted: boolean;
  success: boolean;
  messageForm: any;
  form: FormGroup;
  deleteForm: FormGroup;

  messageFormDeleteCustomer: any;


  constructor(private formBuilder: FormBuilder, private formBuilderDelete: FormBuilder, private customerService: CustomerService) { }

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
//TODO: Continue here




  }

  private buildRequestDataAddCustomer() {
    let formObj = this.form.getRawValue();
    var requestData = {
      customer_info : {
        dni : formObj.dni,
        first_name : formObj.firstName,
        last_name : formObj.lastName,
        current_address : formObj.address
        //requestData.customer_info.email_address = formObj.emailAddress;
      },
      phone :formObj.phone
    };
  //  requestData.customer_info = {};
    return requestData;

  }

  /*private buildRequestDataRemoveCustomer() {

  }*/

//TODO: Handle in API how to retrieve _id from DNI (not client side)
  private deleteCustomer(){
    let formObj = this.deleteForm.getRawValue();
    let id = formObj.customerId;

    this.customerService.removeCustomer(id).subscribe(result => {
        console.log(result);
        this.deleteForm.reset();
        this.mode = null;
        this.message = 'deletecustomer';
      }
    );
  }

  private createCustomer(){
    //{'name' : 'Pepe'}
     // {name: '', description: ''}
    let data = this.buildRequestDataAddCustomer();
    //{firstName: "Juan Manuel", secondName: "Gomez ", emailAddress: "juanma@bank.com", dni: "5639118F", phone: "659121818"}
    //let serializedForm = JSON.stringify(data);

    this.customerService.createCustomer(data).subscribe(result => {
        console.log(result);
        this.form.reset();
        this.mode = null;
        this.message = 'addcustomer';
      }
    );
  }

}
