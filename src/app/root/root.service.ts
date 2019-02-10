import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RootService {

  constructor(private http: HttpClient) { }

  getAPIData(){
    return this.http.get('https://enigmatic-mountain-27495.herokuapp.com/tasks');
  }

  postAPIData(){
    return this.http.post('https://enigmatic-mountain-27495.herokuapp.com/tasks', {'name' : 'Pepe'});
  }

}
