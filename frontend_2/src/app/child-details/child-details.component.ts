import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ChildService } from '../services/child.service';
import * as L from 'leaflet';

@Component({
  selector: 'app-child-details',
  templateUrl: './child-details.component.html',
  styleUrls: ['./child-details.component.scss']
})
export class ChildDetailsComponent implements OnInit {



  full_data = [];
  child_name: string;
  child_id: string;
  positionRules: [];
  devicePositions: [];
  name: string;
  latitude: number;
  longitude: number;


  constructor(private childService: ChildService,
              private route: ActivatedRoute) { }

  ngOnInit(): void {

    const id = this.route.snapshot.params['_id'];
    this.getMoreInformation(id);


  }

  getMoreInformation(id: string){
console.log(id)
    this.childService.getOneChildInformation(id).then(
      data =>{
        // console.log(data);
        this.full_data = data;
        // console.log(this.full_data);
        this.child_name = this.full_data['name'];
        this.child_id =this.full_data['_id'];
        this.positionRules = this.full_data['positionRules'];
        console.log(data);
        console.log(this.full_data)
        this.devicePositions = this.full_data['positionDevice'];

        // console.log(this.child_id);
        console.log(this.devicePositions);
      }

    );

    const child = this.full_data.find(
      (data) => {
        return data.id === id;
      }
    );
    return child;

  }


  setFromMap(e){
    // console.log(this.full_data);
        // console.log(e);

  }


  // this.mapService.addMarker({ latitude: localisation.lat, longitude: localisation.lng, name: localisation.name });
}
