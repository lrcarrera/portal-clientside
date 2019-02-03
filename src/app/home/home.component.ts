import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  users: Object;
  tasks: any;
  h1Style: boolean;

  constructor(private data: DataService) { }

  ngOnInit() {
    this.data.getUsers().subscribe(data => {
        this.users = data
        console.log(this.users);
      }
    );

    this.data.getTasks().subscribe(data => {
        this.tasks = data
        console.log(this.tasks);
      }
    );
  }

  firstClick() {
    console.log('sup fool!');
    this.h1Style = true;
    window.alert('tasks->'+this.tasks);
  }

}
