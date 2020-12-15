import { StatusService } from './services/status.service';
import { PlaceService } from './services/place.service';
import { ChildService } from './services/child.service';
import { AuthGuard } from './services/auth-gaurd.service';
import { AuthService } from './services/auth.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { LoginComponent } from './Auth/login/login.component';
import { RegisterComponent } from './Auth/register/register.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { FortoforComponent } from './fortofor/fortofor.component';
import { MainPageComponent } from './main-page/main-page.component';
import { AddChildComponent } from './add-child/add-child.component';
import { MapComponent } from './map/map.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatCheckboxModule} from '@angular/material/checkbox';
// import {MatListModule} from '@angular/material/list';
import { ListScheduleComponent } from './Schedule/list-schedule/list-schedule.component';
import { AddScheduleComponent } from './Schedule/add-schedule/add-schedule.component';
import { AddPlaceComponent } from './Place/add-place/add-place.component';
import { StatusComponent } from './Place/status/status.component';
import { ScheduleService } from './services/list-schedule.service';
import { ListChildComponent } from './list-child/list-child.component';
import { ListPlaceComponent } from './Place/list-place/list-place.component';
// import { googleMapsApiKey } from './keys';
import { MarkerService } from './services/marker.service';
import { FunctionalitiesComponent } from './functionalities/functionalities.component';


// import { ModalModule } from 'ngx-bootstrap/modal';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ChildDetailsComponent } from './child-details/child-details.component';


const appRoutes: Routes = [

  {path: '', component: MainPageComponent},
  {path: 'home', component: MainPageComponent},
  {path: 'login', component: LoginComponent},
  {path: 'child', canActivate: [AuthGuard], component: AddChildComponent},
  {path: 'func' , canActivate: [AuthGuard], component: FunctionalitiesComponent},
  {path: 'list-child', canActivate: [AuthGuard], component: ListChildComponent},
  {path: 'place', canActivate: [AuthGuard], component: AddPlaceComponent},
  {path: 'list-place', canActivate: [AuthGuard], component: ListPlaceComponent},
  {path: 'edit-schedule', canActivate: [AuthGuard], component: AddScheduleComponent},
  // {path: 'list-schedule', component: ListScheduleComponent},
  {path: 'list-child/:_id',  canActivate: [AuthGuard], component: ChildDetailsComponent},
  // {path: 'status', component: StatusComponent},
  {path: 'testmap',  canActivate: [AuthGuard], component: MapComponent},


  {path: 'not-found', component: FortoforComponent},
  {path: '**', redirectTo: '/not-found'}
]

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    FortoforComponent,
    MainPageComponent,
    AddChildComponent,
    ListScheduleComponent,
    AddScheduleComponent,
    AddPlaceComponent,
    StatusComponent,
    ListChildComponent,
    ListPlaceComponent,
    MapComponent,
    FunctionalitiesComponent,
    ChildDetailsComponent
  ],


  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot(appRoutes),
    BrowserAnimationsModule,
    MatInputModule,
    MatCardModule,
    MatMenuModule,
    MatTabsModule,
    MatFormFieldModule,
    MatButtonModule,
    MatCheckboxModule,
    MatIconModule,
    NgbModule,


  ],



  providers: [
    AuthService,
    ChildService,
    PlaceService,
    ScheduleService,
    AuthGuard,
    MarkerService,
    StatusService
  ],



  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
