import { Router } from '@angular/router';
import { StatusService } from './../../services/status.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-status',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.scss']
})
export class StatusComponent implements OnInit {

  constructor(private seviceStatus: StatusService,
              private router: Router) { }

  ngOnInit(): void {
  }

}
