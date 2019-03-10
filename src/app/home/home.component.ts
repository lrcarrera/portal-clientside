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
  public tiles = [
    //{ text: 'One', cols: 2, rows: 1, color: 'lightblue' },
    { text: 'Two', cols: 1, rows: 1, color: 'lightgreen' },
    { text: 'Three', cols: 3, rows: 1, color: 'lightpink' },
    //{ text: 'Four', cols: 2, rows: 1, color: '#DDBDF1' },
  ];

  public frontWidgets = [
    //{ text: 'One', cols: 2, rows: 1, color: 'lightblue' },
    { text: 'Two', cols: 1, rows: 2, color: 'lightgreen' },
    { text: 'Three', cols: 1, rows: 2, color: 'lightpink' },
    { text: 'Four', cols: 1, rows: 2, color: '#DDBDF1' },
  ];

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
