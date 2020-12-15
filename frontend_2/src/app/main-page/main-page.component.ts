import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent implements OnInit {

  myimage1:string = "./assets/pictures/localisation.jpg";
  constructor() { }

  ngOnInit(): void {
  }

}
