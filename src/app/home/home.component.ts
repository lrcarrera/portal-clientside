import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private data: DataService) { }


  ngOnInit() {
  }

  firstClick() {
    console.log('sup fool!');
    this.h1Style = true;
  }

}
