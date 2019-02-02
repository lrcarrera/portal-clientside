import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  link: any;

  constructor() { }


  ngOnInit() {
    //this.link = this.router.navigate(['/externalRedirect', { externalUrl: 'www.google.com' }]);

  }

}
