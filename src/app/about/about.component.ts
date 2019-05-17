import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import { CustomerService } from '../services/customer/customer.service';

export interface CustomerData {
  customerId: string;
  name: string;
  address: string;
  phone: string;
}

 @Component({
   selector: 'table-with-customers',
   templateUrl: './about.component.html',
   styleUrls: ['./about.component.scss']
 })
export class AboutComponent implements OnInit {
  displayedColumns: string[] = ['customerId', 'name', 'address', 'phone'];
  dataSource: MatTableDataSource<CustomerData>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private customerService: CustomerService) {

  //this.dataSource = new MatTableDataSource(users);
  }

  ngOnInit() {

    this.customerService.getAllCustomers().subscribe((result:any) => {
        console.log(result);
        if(result){
          var customers = cleanResponseToUI(result);
          this.dataSource = new MatTableDataSource(customers);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        }else{
        //  this.findForm.reset();
        }
      },
      error => {
      //  this.errors = error;
      }
    );


  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }


}

/** Builds and returns a new User. */
/*function createNewUser(id: number): UserData {
  const name =
      NAMES[Math.round(Math.random() * (NAMES.length - 1))] + ' ' +
      NAMES[Math.round(Math.random() * (NAMES.length - 1))].charAt(0) + '.';

  return {
    id: id.toString(),
    name: name,
    progress: Math.round(Math.random() * 100).toString(),
    color: COLORS[Math.round(Math.random() * (COLORS.length - 1))]
  };
}*/

function cleanResponseToUI(response:any){

  var cleanResponse = [];
  for(var i in response){
      var cleanCustomer:any = {};
      cleanCustomer.customerId = response[i].dni;
      cleanCustomer.name = response[i].customer_info.first_name + " " + response[i].customer_info.last_name;
      cleanCustomer.address = response[i].customer_info.current_address;
      cleanCustomer.phone = response[i].phone;
      cleanResponse.push(cleanCustomer);
  }
  return cleanResponse;
}
