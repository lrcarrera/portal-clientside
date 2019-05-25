import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {DataModel} from '../../home/home.component';


export interface DataModel {
  account_name: string;
  total_movements: number;
}

export interface RelationsModel {
  advisor_name: string;
  familiar_group: object;
  economical_group: object;
}


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
    return this.http.put("http://localhost:5000/customer/" + id, customer);
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
    return this.http.get<DataModel>("https://enigmatic-mountain-27495.herokuapp.com/movement/" + id);
  }

  /**************************************RELATIONS WITH BANK ROUTES**************************************/

  getRelationsByCustomer(id){
    return this.http.get<RelationsModel>("https://enigmatic-mountain-27495.herokuapp.com/relations/" + id);

  }

  /****************************************ADVISOR ROUTES***********************************************/

  getAllCustomersByAdvisorId(id){
    return this.http.get('https://enigmatic-mountain-27495.herokuapp.com/customerbyadvisor/' + id);
  }
}
