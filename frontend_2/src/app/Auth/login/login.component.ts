import { Router } from '@angular/router';
import { AuthService } from './../../services/auth.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  successMessage = '';
  errorMessage = '';
  model: any = {};
  constructor(private authService: AuthService,
              private router: Router) { }

  ngOnInit(): void {
  }

  Login(){

    this.authService.logIn(this.model).subscribe( res => {
      console.log('login successful!', res);

      this.successMessage = 'Login successful!';

    }, error => {
      console.log(error);
      this.errorMessage = 'Something wrong, please check your login or password and try again!';
      window.location.reload();

    });

}
LogUp(){

  this.authService.Register(this.model).subscribe( ()  => {
    console.log("OK");
    this.successMessage = 'register successful!';
    alert('Welcome! You are a User on our platform now.');
    this.router.navigate(['/home']);


  }, error => {
    console.log(error);
    this.errorMessage = 'Something wrong';
    // this.router.navigate(['/login']);
    window.location.reload();

  });

}

}
// console.log('registration successful!');
// this.successMessage =;
// this.router.navigate(['/login']);

// }, error => {
//
// // alert(error);
// // window.location.reload();
// this.model.name = '';
// this.model.surname = '';
// this.model.login = '';
// this.model.password = '';
// this.router.navigate(['/register']);
