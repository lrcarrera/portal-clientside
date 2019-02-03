import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http: HttpClient) { }

  getUsers() {
    return this.http.get('https://reqres.in/api/users');
  }

  getTasks(){
    return this.http.get('https://enigmatic-mountain-27495.herokuapp.com/hola');
  }
  firstClick() {
    return console.log('clicked');
  }
}
