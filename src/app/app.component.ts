import { Component, OnInit} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'ng7-pre';
  restItems: any;
    restItemsUrl = 'https://enigmatic-mountain-27495.herokuapp.com/hola';

    constructor(private http: HttpClient) {}

    ngOnInit() {
      this.getRestItems();
    }

    // Read all REST Items
    getRestItems(): void {
      this.restItemsServiceGetRestItems()
        .subscribe(
          restItems => {
            this.restItems = restItems;
            console.log(this.restItems);
          }
        )
    }

    // Rest Items Service: Read all REST Items
    restItemsServiceGetRestItems() {
      return this.http
        .get<any[]>(this.restItemsUrl)
        .pipe(map(data => data));
    }
  }
