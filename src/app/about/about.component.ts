import {Component,Input,OnChanges,OnInit,SimpleChanges,ViewChild} from '@angular/core';
import {MatPaginator,MatSort,MatTableDataSource} from '@angular/material';
import {CustomerService} from '../services/customer/customer.service';
import {AuthenticationService,UserDetails} from '../authentication/authentication.service';

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
export class AboutComponent implements OnInit,OnChanges {
  displayedColumns: string[] = ['customerId','name','address','phone'];
  dataSource: MatTableDataSource<CustomerData>;
  advisorDetails: UserDetails;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  @Input()
  dataCustomerTable: boolean = false;

  constructor(private authenticationService: AuthenticationService,private customerService: CustomerService) {
  }

  ngOnInit() {
    this.fillTable();
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.fillTable();
  }

  private fillTable() {
    this.authenticationService.profile().subscribe(user => {
      this.advisorDetails = user.authorizedData;

      if (this.advisorDetails.role === 'Admin') {
        this.customerService.getAllCustomers().subscribe((result: any) => {
          this.checkResponse(result);
        });
      } else {
        this.customerService.getAllCustomersByAdvisorId(this.advisorDetails._id).subscribe((result: any) => {
          this.checkResponse(result);
        });
      }
    },(err) => {
      console.error(err);
    });
  }

  private checkResponse(result: any) {
    if (result) {
      var customers = cleanResponseToUI(result);
      this.dataSource = new MatTableDataSource(customers);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }

  }
}

function cleanResponseToUI(response: any) {
  const cleanResponse = [];
  for (let i in response) {
    let cleanCustomer: any = {};
    cleanCustomer.customerId = response[i].dni;
    cleanCustomer.name = response[i].customer_info.first_name + ' ' + response[i].customer_info.last_name;
    cleanCustomer.address = response[i].customer_info.current_address;
    cleanCustomer.phone = response[i].phone;
    cleanResponse.push(cleanCustomer);
  }
  return cleanResponse;
}
