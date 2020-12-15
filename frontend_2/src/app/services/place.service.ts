import { HttpClient } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable()
export class PlaceService{

  baseUrl = 'http://ec2-3-15-216-171.us-east-2.compute.amazonaws.com:3000/';

  constructor(private http: HttpClient,  private authService: AuthService,
              private router: Router){}


  PlaceAdded(model: any): Promise<any>{
    return this.http.post(this.baseUrl + 'place', model, {headers: this.authService.getAuthHeaders(),  responseType: 'text'}).toPromise();
  }

  GetPlaces(): Promise<any> {
    return this.http.get(this.baseUrl + 'places', {headers: this.authService.getAuthHeaders()})
    .toPromise();
  }

  // DeletePlace(placeId: string){
  //   const urlplace = 'http://ec2-3-15-216-171.us-east-2.compute.amazonaws.com:3000/place/' + placeId;
  //   return this.http.delete(urlplace, {headers: this.authService.getAuthHeaders()});
  // }

  DeletePlace(placeId: string): Promise<any>{
    
   return this.http.delete(this.baseUrl + 'place/' + placeId, {headers: this.authService.getAuthHeaders()}).toPromise().then(
     reponse => {
       alert('Are you sure you want to remove this place from your list?');
     }
   ).catch( error => {
     console.log(error);
   });
 }
}
