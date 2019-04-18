import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import { CustomerService } from '../services/customer/customer.service';

export interface CustomerData {
  customerId: string;
  name: string;
  address: string;
  phone: string;
}

/** Constants used to fill up our data base. */
const COLORS: string[] = ['maroon', 'red', 'orange', 'yellow', 'olive', 'green', 'purple',
  'fuchsia', 'lime', 'teal', 'aqua', 'blue', 'navy', 'black', 'gray'];
const NAMES: string[] = ['Maia', 'Asher', 'Olivia', 'Atticus', 'Amelia', 'Jack',
  'Charlotte', 'Theodore', 'Isla', 'Oliver', 'Isabella', 'Jasper',
  'Cora', 'Levi', 'Violet', 'Arthur', 'Mia', 'Thomas', 'Elizabeth'];

/**
 * @title Data table with sorting, pagination, and filtering.
 */
 @Component({
   selector: 'app-about',
   templateUrl: './about.component.html',
   styleUrls: ['./about.component.scss']
 })
export class AboutComponent implements OnInit {
  displayedColumns: string[] = ['customerId', 'name', 'address', 'phone'];
  dataSource: MatTableDataSource<CustomerData>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private customerService: CustomerService) {

    // Create 100 users
  //  const users = Array.from({length: 10}, (_, k) => createNewUser(k + 1));

    // Assign the data to the data source for the table to render
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
