import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  constructor(private http: HttpClient) { }

  /**************************************CUSTOMER ROUTES**************************************/

  getAllCustomers(){
    return this.http.get('https://enigmatic-mountain-27495.herokuapp.com/customer');
  }

  createCustomer(customer){
    return this.http.post('https://enigmatic-mountain-27495.herokuapp.com/customer', customer);
  }

  removeCustomer(id){
    return this.http.delete("https://enigmatic-mountain-27495.herokuapp.com/customer/" + id);
  }

  getCustomer(id){
    return this.http.get("https://enigmatic-mountain-27495.herokuapp.com/customer/" + id);
  }
  updateCustomer(id, customer){
    return this.http.put("https://enigmatic-mountain-27495.herokuapp.com/customer/" + id, customer);
  }

  /**************************************ACCOUNT ROUTES**************************************/

  addAccountToCustomer(id, accountData){
    return this.http.put("https://enigmatic-mountain-27495.herokuapp.com/account/" + id, accountData);
  }
  getAccountsFromCustomer(id){
    return this.http.get("https://enigmatic-mountain-27495.herokuapp.com/account/" + id);
  }

  /**************************************MOVEMENTS ROUTES**************************************/

  getMovementsByAccount(id){
    return this.http.get("https://enigmatic-mountain-27495.herokuapp.com/movement/" + id);
  }

}
