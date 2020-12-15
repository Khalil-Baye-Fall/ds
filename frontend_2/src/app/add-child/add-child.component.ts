import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ChildService } from '../services/child.service';
import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-add-child',
  templateUrl: './add-child.component.html',
  styleUrls: ['./add-child.component.scss']
})
export class AddChildComponent implements OnInit {

  successMessage = '';
  errorMessage = '';
  model: any = {};
  constructor(private addChild: ChildService,
              private router: Router) { }

  ngOnInit(): void {
  }
  ChildAdded(){
    this.addChild.ChildAdded(this.model).then(

      data =>{

        this.successMessage = (data);
        alert('you just added a new child!');
        window.location.reload();
      }
      ,

      error => {

        this.errorMessage = (error);
        this.errorMessage = 'Oups! something wrong!';
        alert("Please make sure this child was not add before!")
        window.location.reload();


      });

    this.model.name = '';
    this.model.connectionToken = '';

    // console.log('success', data),
    // .subscribe( () => {
    //   this.successMessage = 'Additional information about the child!';
    // }, () => {
    //   this.errorMessage = "Oups! This child has been added..";
    // }
    // );
  }

}
