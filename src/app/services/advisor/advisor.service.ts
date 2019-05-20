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

export class AdvisorService {

  constructor(private http: HttpClient) { }

  /**************************************ADVISOR EXTERNAL ROUTES**************************************/

  getAdvisor(id){
    return this.http.get("https://enigmatic-mountain-27495.herokuapp.com/advisor/" + id);
  }

  getAllAdvisors(){
    return this.http.get('https://enigmatic-mountain-27495.herokuapp.com/advisor');
  }
}
