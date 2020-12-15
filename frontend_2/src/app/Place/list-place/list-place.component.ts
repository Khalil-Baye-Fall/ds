import { Component, OnInit } from '@angular/core';
import { PlaceService } from 'src/app/services/place.service';

@Component({
  selector: 'app-list-place',
  templateUrl: './list-place.component.html',
  styleUrls: ['./list-place.component.scss']
})
export class ListPlaceComponent implements OnInit {

  constructor(private placeService: PlaceService) { }

  listPlaces = '';
  listPlacesWithId = [];

  ngOnInit(): void {
    this.getListPlaces();
  }

  getListPlaces(){
  this.placeService.GetPlaces().then(
    data => {
      console.log(data);
      this.listPlacesWithId = data;
      this.listPlaces = data.map(xyz => xyz.name);
      this.listPlaces = data.map(xyz => xyz.latitude);
      this.listPlaces = data.map(xyz => xyz.longitude);
      this.listPlaces = data.map(xyz => xyz.id);


    },
    error => console.log('oops', error));
}

deletePlace(id: string){
  this.placeService.DeletePlace(id).then(
    data => {
      console.log('Delete');
      alert('Are you sure?');
      window.location.reload();
    },
    err => {
      console.log(err);
    }
  );
  // window.location.reload();
}
}