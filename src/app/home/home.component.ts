import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { RootService } from '../root/root.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  users: Object;
  customers: Object;
  h1Style: boolean;

  constructor(private data: DataService, private customerService: RootService) { }

  ngOnInit() {
    this.data.getUsers().subscribe(data => {
        this.users = data;
        console.log(this.users);
      }
    );



/*
    this.data.getTasks().subscribe(data => {
        this.tasks = data
        console.log(this.tasks);
      }
    );*/
  }

  invokePost(){
    this.customerService.postAPIData().subscribe(result => {
        console.log(result);
      }
    );

  }

  firstClick() {
    console.log('see the list!');
    this.h1Style = true;

    this.customerService.getAPIData().subscribe(result => {
        this.customers = result;
        console.log(this.customers);
      }
    );
   //this.customers.postApiData();
  }

}
