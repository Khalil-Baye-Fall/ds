import { Component, OnInit, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { ChildService } from '../services/child.service';

import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';





@Component({
  selector: 'app-list-child',
  templateUrl: './list-child.component.html',
  styleUrls: ['./list-child.component.scss']
})
export class ListChildComponent implements OnInit {

  name: string;
  listChilds = '';
  childsWithId = [];
  displayedColumns: string[] = ['name'];
  // Message: string;

  full_data = [];


  number_id: string;
  from_datetime: string;
  to_datetime: string;
  child_name: string;
  positionRules: [];
  devicePositions = [];
  latitude: number;
  longitude: number;


  constructor(private childService: ChildService,
              private router: Router,
              config: NgbModalConfig,
              private modalService: NgbModal) {
                config.backdrop = 'static';
                config.keyboard = false;
               }


  ngOnInit(): void {
    this.getChildAdded();
  }

  // public openModal(template: TemplateRef<any>){
  //   this.modalRef = this.modalService.show(template);
  // }
  open(content) {
    this.modalService.open(content);
  }





  getChildAdded(){
    this.childService.GetChilds().then(
      data => {
        // console.log(data);
        this.childsWithId = data;
        this.listChilds = data.map(child => child.name);
        this.listChilds = data.map(child => child.id);

      },
      error => console.log('oops', error));
  }


  getMoreInformation(id: string){

    this.childService.getOneChildInformation(id).then(
      data =>{
        // console.log(data),
        this.full_data = data;
        console.log(this.full_data);
        this.child_name = this.full_data['name'];
        this.positionRules = this.full_data['positionRules'];
        this.devicePositions = this.full_data['positionDevice'];
      }

    );

  }

  addSchedule(id: string){
    this.router.navigate(['edit-schedule'], { queryParams: {deviceId: id}});
  }

  deleteChild(id: string){
     this.childService.DeleteChild(id).then(
      data => {
        alert('Do you want to delete this child?');
         window.location.reload();
       }, error => {
        console.log(error);
      }
     );

  }



  setFromMap(e){

    console.log(e);
    this.longitude = e.longitude;
    this.latitude = e.latitude;

  }

}

