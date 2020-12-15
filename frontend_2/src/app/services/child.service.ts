import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { error } from 'protractor';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service'

@Injectable()
export class ChildService{

  baseUrl = 'http://ec2-3-15-216-171.us-east-2.compute.amazonaws.com:3000/';

  constructor(private http: HttpClient, private authService: AuthService,
              private router: Router){}


  ChildAdded(model: any){
    return this.http.post(this.baseUrl + 'devices', model, {headers: this.authService.getAuthHeaders(),  responseType: 'text'})
    .toPromise();
  }

  GetChilds(): Promise<any> {
    return this.http.get(this.baseUrl + 'devices', {headers: this.authService.getAuthHeaders()})
    .toPromise();
  }

  getOneChildInformation(id: string): Promise<any>{
    return this.http.get(this.baseUrl + 'devices/' + id, {headers: this.authService.getAuthHeaders()})
    .toPromise();
  }

  DeleteChild(childId: string): Promise<any>{
     const url = 'http://ec2-3-15-216-171.us-east-2.compute.amazonaws.com:3000/devices/' + childId ;

    return this.http.delete(this.baseUrl + 'devices/' + childId, {headers: this.authService.getAuthHeaders()}).toPromise().then(
      reponse => {
        alert('Are you sure you want to remove this child from your list?');
      }
    ).catch( error => {
      console.log(error);
    });
  }

  // DeleteChild(id: string): Observable<string>{

  //   let httpheader = new HttpHeaders().set('Content-Type', 'application/json');
  //   let options= {
  //     headers:httpheader
  //   };
  //   return this.http.delete<string>(this.baseUrl + 'devices/' + id , {headers: this.authService.getAuthHeaders()});
  // }

}
