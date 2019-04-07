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
    return this.http.delete("https://enigmatic-mountain-27495.herokuapp.com/customer/"+id);
  }

  getCustomer(id){
    return this.http.get("https://enigmatic-mountain-27495.herokuapp.com/customer/"+id);
  }
  updateCustomer(id, customer){
    return this.http.put("https://enigmatic-mountain-27495.herokuapp.com/customer/"+id, customer);
  }
  
}
