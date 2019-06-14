import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {DataModel} from '../../home/home.component';

@Injectable({
  providedIn: 'root'
})

export class CustomerService {
  endPoint : string = 'https://enigmatic-mountain-27495.herokuapp.com';
  //endPoint : string = 'http://localhost:5000';

  constructor(private http: HttpClient) {
  }
  /**************************************CUSTOMER ROUTES**************************************/

  getAllCustomers() {
    return this.http.get(this.endPoint + '/customer');
  }

  createCustomer(customer) {
    return this.http.post(this.endPoint + '/customer', customer);
  }

  removeCustomer(id) {
    return this.http.delete(this.endPoint + '/customer/' + id);
  }

  getCustomer(id) {
    return this.http.get(this.endPoint + '/customer/' + id);
  }

  updateCustomer(id,customer) {
    return this.http.put(this.endPoint + '/customer/' + id,customer);
  }

  /**************************************ACCOUNT ROUTES**************************************/

  addAccountToCustomer(id,accountData) {
    return this.http.put(this.endPoint + '/account/' + id,accountData);
  }

  getAccountsFromCustomer(id) {
    return this.http.get(this.endPoint + '/account/' + id);
  }

  /**************************************MOVEMENTS ROUTES**************************************/

  getMovementsByAccount(id) {
    return this.http.get<DataModel>(this.endPoint + '/movement/' + id);
  }

  addMovementToAccount(id,movementData) {
    return this.http.put(this.endPoint + '/movement/' + id,movementData);
  }

  /**************************************RELATIONS WITH BANK ROUTES**************************************/

  getRelationsByCustomer(id) {
    return this.http.get<RelationsModel>(this.endPoint + '/relations/' + id);

  }

  setProfileToCustomer(id,profileData) {
    return this.http.put<RelationsModel>(this.endPoint + '/product/' + id,profileData);
  }

  /****************************************ADVISOR ROUTES***********************************************/

  getAllCustomersByAdvisorId(id) {
    return this.http.get(this.endPoint + '/customerbyadvisor/' + id);
  }
}

export interface DataModel {
  account_name: string;
  total_movements: number;
}

export interface RelationsModel {
  advisor_name: string;
  familiar_group: object;
  economical_group: object;
}
