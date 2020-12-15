
import { PlaceService } from '../../services/place.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-add-place',
  templateUrl: './add-place.component.html',
  styleUrls: ['./add-place.component.scss']
})
export class AddPlaceComponent implements OnInit {

  successMessage = '';
  errorMessage = '';
  alertMessage = '';
  model: any = {};
  latitude: number;
  longitude: number;
  name: string;
  constructor(private addPlaceService: PlaceService) { }

  ngOnInit(): void {
  }


  PlaceAdd(){
    // console.log(this.model);
    if (this.model.name == undefined || this.model.latitude == undefined || this.model.longitude == undefined ){
      this.alertMessage = 'Please fill in all fields for complete information.';
      // window.location.reload();
    }
      else {
    this.addPlaceService.PlaceAdded(this.model).then(() => {
          this.successMessage = 'Place added successful!';
          alert("This place is add!")
          window.location.reload();

    }).catch(err => {
      this.errorMessage = 'Something is not correct. Please try again!';
      window.location.reload();
    });


    // this.model.name = '';
    // this.model.latitude = '';
    // this.model.longitude = '';
  }
  }

  setFromMap(e){

    // console.log(e);
    this.longitude = e.longitude;
    this.latitude = e.latitude;
    this.model.longitude = e.longitude;
    this.model.latitude = e.latitude;
  }

}
