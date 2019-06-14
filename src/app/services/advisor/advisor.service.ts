import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class AdvisorService {
  endPoint : string = 'https://enigmatic-mountain-27495.herokuapp.com';
  //endPoint : string = 'http://localhost:5000';

  constructor(private http: HttpClient) {
  }
  /**************************************ADVISOR EXTERNAL ROUTES**************************************/

  getAdvisor(id) {
    return this.http.get(this.endPoint + '/advisor/' + id);
  }

  getAllAdvisors() {
    return this.http.get(this.endPoint + '/advisor');
  }

  createTaskFromAdvisor(id,taskData) {
    return this.http.put<RelationsModel>(this.endPoint + '/task/' + id,taskData);
  }
}

export interface RelationsModel {
  advisor_name: string;
  familiar_group: object;
  economical_group: object;
}
