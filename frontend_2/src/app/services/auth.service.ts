
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';

@Injectable()
export class AuthService{



  private baseUrl = 'http://ec2-3-15-216-171.us-east-2.compute.amazonaws.com:3000/';

  connectionToken = undefined;

  constructor(private http: HttpClient,
              private router: Router){}




  // Register(model){
  //   // return this.http.post<any>(this.baseUrl + 'parent/register', model);

  //   return this.http.post<any>(this.baseUrl + 'parent/register', model, { responseType: 'json'});
  // }
  Register(model: any){

    // tslint:disable-next-line: ban-types
    const requestOptions: Object = {
      responseType: 'text'
    };
    return this.http.post<any>(this.baseUrl + 'parent/register', model, requestOptions);


  }


  logIn(model: any) {
    return this.http.post('http://ec2-3-15-216-171.us-east-2.compute.amazonaws.com:3000/parent/login', model).pipe(
      map((response: any) => {
        const user = response;
        if (user) {
          alert('Welcome to our app localization!');
          this.router.navigate(['/func']);
          localStorage.setItem('token', user.token);
        }
      })
    );
  }

  loggedIn(){
    return !!localStorage.getItem('token');
  }

  SignOut(){
    localStorage.removeItem('token');
    this.router.navigate(['/home']);

  }

  getAuthHeaders(): HttpHeaders{
    let headers = new HttpHeaders();
    headers = headers.append('authorization', `Bearer ${localStorage.getItem('token')}`);
    headers = headers.append('Content-Type', 'application/json');
    return headers;
  }

}


