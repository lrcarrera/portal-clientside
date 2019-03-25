import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  constructor(private http: HttpClient) { }

  getAllCustomers(){
    return this.http.get('https://enigmatic-mountain-27495.herokuapp.com/customer');
  }

  createCustomer(customer){
    return this.http.post('https://enigmatic-mountain-27495.herokuapp.com/customer', customer);
  }

  removeCustomer(id){
    let httpParams = new HttpParams().set('customerId', id);
    let options = { params: httpParams };

    return this.http.delete('https://enigmatic-mountain-27495.herokuapp.com/customer',options);
  }
}
