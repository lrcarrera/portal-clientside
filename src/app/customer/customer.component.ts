import {Component,Inject,OnInit} from '@angular/core';
import {FormBuilder,FormControl,FormGroup,FormGroupDirective,NgForm,Validators} from '@angular/forms';
import {CustomerService} from '../services/customer/customer.service';
import {ErrorStateMatcher} from '@angular/material/core';
import {MatSnackBar} from '@angular/material';
import {AuthenticationService,UserDetails} from '../authentication/authentication.service';
import {AboutComponent} from '../about/about.component';
import {Observable} from 'rxjs';
import {AdvisorService} from '../services/advisor/advisor.service';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null,form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

export interface Level {
  level: string;
}

export interface Advisor {
  role: string;
  _id: string;
  name: string;
  email: string;
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
  findForm: FormGroup;

  updateCustomerForm: boolean;
  addCustomerForm: boolean;

  dniUpdateInContext: string;

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

  advisors: Advisor[] = [];

  isAdmin: boolean = false;

  triggerTable: boolean = false;


  constructor(private advisorService: AdvisorService,
              private customerTable: AboutComponent,
              private snackBar: MatSnackBar,
              private authenticationService: AuthenticationService,
              private formBuilder: FormBuilder,
              private formBuilderUpdate: FormBuilder,
              private formBuilderFind: FormBuilder,
              private customerService: CustomerService) {
  }

  ngOnInit() {
    /*this.deleteForm = this.formBuilderDelete.group({
      customerId: ['', Validators.required],
    });*/


    this.updateCustomerFb = this.formBuilder.group({
      updateCustomerLevel: [null,Validators.required],
      updateCustomerOffice: [null,Validators.required],
      updateCustomerAdvisor: [null,Validators.required]

    });

    this.findForm = this.formBuilderFind.group({
      customerId: ['',Validators.required],
    });

    this.updateCustomerForm = false;
    this.addCustomerForm = false;

    this.authenticationService.profile().subscribe(user => {
      this.details = user.authorizedData;
    },(err) => {
      console.error(err);
    });

    this.isAdmin = this.authenticationService.isAdmin();


    if (this.isAdmin) {
      this.advisorService.getAllAdvisors().subscribe((result: any) => {
        result.forEach((advisor: Advisor) => {
          this.advisors.push(advisor);
        });
      },(err) => {
        console.error(err);
      });
    }
  }

  private cleanAddForm(){
    if (this.isAdmin) {
      this.advisorControl.reset();
    }
    this.firstNameControl.reset();
    this.lastNameControl.reset();
    this.homeControl.reset();
    this.exposureControl.reset();
    this.dniControl.reset();
    this.phoneControl.reset();
    this.officeControl.reset();
  }

  private buildRequestDataCustomer() {

    //let formObj = this.form.getRawValue();
    //  requestData.customer_info = {};
    let advisorInContext;
    if (this.isAdmin) {
      advisorInContext = this.advisorControl.value;
    } else {
      advisorInContext = this.details._id;
    }
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
      advisor: advisorInContext
    };
  }

  /*

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
    ]);*/

  private buildRequestDataCustomerToUpdate() {

    //let formObj = this.form.getRawValue();
    //  requestData.customer_info = {};
    let advisorInContext;
    if (this.isAdmin) {
      advisorInContext = this.updateCustomerFb.controls['updateCustomerAdvisor'].value._id;
    } else {
      advisorInContext = this.details._id;
    }
    return {
      customer: {
        customer_info: {
          first_name: this.firstNameControlUpdate.value,
          last_name: this.lastNameControlUpdate.value,
          current_address: this.homeControlUpdate.value,
          risk_money_laundering: this.updateCustomerFb.controls['updateCustomerLevel'].value.level
          //email_address = formObj.emailAddress;
        },
        dni: this.dniControlUpdate.value,
        phone: this.phoneControlUpdate.value,
        assigned_office: this.updateCustomerFb.controls['updateCustomerOffice'].value.name,
        advisor: advisorInContext
      },
    };
  }

  private findCustomer() {
    let id = this.findToUpdateControl.value;

    this.customerService.getCustomer(id).subscribe((result: any) => {
        console.log(result);
        if (result) {

          this.dniUpdateInContext = result.dni;
          this.firstNameControlUpdate.setValue(result.customer_info.first_name);
          this.lastNameControlUpdate.setValue(result.customer_info.last_name);
          this.dniControlUpdate.setValue(result.dni);
          this.homeControlUpdate.setValue(result.customer_info.current_address);
          this.phoneControlUpdate.setValue(result.phone);

          const toSelectLevel = this.exposureLevels.find(c => c.level == result.customer_info.risk_money_laundering[0]);
          this.updateCustomerFb.get('updateCustomerLevel').setValue(toSelectLevel);

          const toSelectOffice = this.offices.find(c => c.name == result.assigned_office[0]);
          this.updateCustomerFb.get('updateCustomerOffice').setValue(toSelectOffice);

          if (this.isAdmin) {
            const toSelectAdvisor = this.advisors.find(advisor => advisor.email === this.getAdvisorEmailToFillCombo(result.advisor));
            this.updateCustomerFb.get('updateCustomerAdvisor').setValue(toSelectAdvisor);
          }
          this.updateCustomerForm = true;
        } else {
          this.openSnackBar('Customer not found');
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

  private getAdvisorEmailToFillCombo(advisorId) {
    return this.advisors.find(advisor => advisor._id === advisorId).email;
  }

  private updateCustomer() {
    let data = this.buildRequestDataCustomerToUpdate();
    let dni = this.dniUpdateInContext;

    this.customerService.updateCustomer(dni,data).subscribe(result => {
        console.log(result);
        this.openSnackBar('The customer was updated successfully');
        this.triggerCustomerTable();
        this.updateCustomerForm = false;

      },
      error => {
        this.openSnackBar('The service is unavailable');
        this.updateCustomerForm = false;

        console.log(error);
      },
      () => {
        // No errors, route to new page
      }
    );
  }

  private triggerCustomerTable() {
    this.triggerTable = !this.triggerTable;
    this.dataCustomerTable = new Observable(observer => {
      observer.next(this.triggerTable);
      observer.complete();
    });
  }

  private deleteCustomer() {
    let id = this.findControl.value;

    this.customerService.removeCustomer(id).subscribe((result: any) => {

        if (result && result.n === 1) {
          console.log(result);
          //this.deleteForm.reset();
          this.mode = null;
          this.openSnackBar('The customer was deleted successfully');


          this.triggerCustomerTable();

          this.findControl.setValue('');
        } else {
          this.findControl.setValue('');

          this.openSnackBar('Customer not found');
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

  private createCustomer() {
    let data = this.buildRequestDataCustomer();

    this.customerService.createCustomer(data).subscribe((result: any) => {
        //console.log(result);
        //this.form.reset();
        if (result.code === 11000) {
          this.openSnackBar('Another customer with the same ID was found');
        } else {
          this.openSnackBar('The customer was added successfully');
          this.triggerCustomerTable();
        }
        this.mode = null;
        this.addCustomerForm = false;
        this.cleanAddForm();
      },
      error => {

        this.openSnackBar('The service is unavailable');
        this.mode = null;
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

  advisorControl = new FormControl('',[
    Validators.required,
  ]);
  levelExposure: any;
  stageValue: string;
}
