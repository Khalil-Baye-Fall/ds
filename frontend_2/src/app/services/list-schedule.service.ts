import { HttpClient } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { Router } from '@angular/router';

import { AuthService } from './auth.service';

@Injectable()
export class ScheduleService{

  baseUrl = 'http://ec2-3-15-216-171.us-east-2.compute.amazonaws.com:3000/';

  connectionToken = undefined;

  selectedIdDevice = undefined;

  constructor(private http: HttpClient, private authService: AuthService,
              private router: Router){}


AddSchedule(placeId: string, model: any){
  return this.http.post(this.baseUrl + 'device/' + placeId + '/rule', model,
  {headers: this.authService.getAuthHeaders(), responseType: 'text'}).toPromise();
}

GetSchedule(){

}
}
// `device/${deviceId}/rule`
