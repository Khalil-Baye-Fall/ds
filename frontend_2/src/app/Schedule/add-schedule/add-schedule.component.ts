import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { ScheduleService } from 'src/app/services/list-schedule.service';
import { PlaceService } from 'src/app/services/place.service';

@Component({
  selector: 'app-add-schedule',
  templateUrl: './add-schedule.component.html',
  styleUrls: ['./add-schedule.component.scss']
})
export class AddScheduleComponent implements OnInit {

  successMessage = '';
  errorMessage = '';
  model: any = {} ;
  deviceId = '';
  places = [];
  name: string;
  constructor(private scheduldeService: ScheduleService,
              private placeService: PlaceService,
              private router: Router) {
                this.deviceId = this.router.getCurrentNavigation().extras.queryParams['deviceId'];
                this.getMyPlaces();
               }

  ngOnInit(): void {
  }

  getMyPlaces(){
    this.placeService.GetPlaces().then(
      data => {
    this.places = data;
    console.log(this.places);
  });
  }

  setPlace(placeId){
    console.log(placeId);
    this.model['placeId'] = placeId;

  }

  scheduleAdded(){

    console.log(this.deviceId);
    if(this.model["from_datetime"] && this.model["from_datetime"].length > 0 && this.model.placeId !== 0 && this.model.placeId.length > 0){
      this.scheduldeService.AddSchedule(this.deviceId, this.model).then( response => {
        alert('Schedule added successfuly!');
        // console.log(response);
        this.router.navigate(['/list-child']);
        // window.location.reload();
      }).catch(error => {
        console.log(error);
        // this.errorMessage = "Oups, Something wrong! Please ty again.";
        alert('Oups, Something wrong! Please ty again.');
        // window.location.reload();
        this.router.navigate(['/list-child']);
      }
      );
    }

  }

}
