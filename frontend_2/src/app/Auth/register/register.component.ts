import { Router } from '@angular/router';
import { AuthService } from './../../services/auth.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  successMessage = '';
  errorMessage = '';
  model: any = {};
  constructor(private authService: AuthService,
              private router: Router) { }

  ngOnInit(): void {
  }

// all are in login.component.ts we will use all in one page..
  onSubmit(){

    this.authService.Register(this.model).subscribe( () => {
      // console.log('registration successfule!');
      this.successMessage = 'registration successfule!';
    }, error => {
      this.errorMessage = 'Oup! you are ready have an account!';
    });

}
}
