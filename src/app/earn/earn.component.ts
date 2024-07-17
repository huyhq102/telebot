import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import axios from 'axios';
import { NgxLoadingModule } from 'ngx-loading';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-earn',
	standalone: true,
	imports: [CommonModule,NgxLoadingModule],
  templateUrl: './earn.component.html',
  styleUrls: ['./earn.component.scss']
})
export class EarnComponent implements OnInit {

	public loading: boolean = false;
  constructor(private httpClient: HttpClient, private router: Router) { }

  totalActivePoint = 0;
  totalPoint = 0
  userInfo: any
  pointHistory: any

  isChecking = false;
  ngOnInit(): void {
    
  }

  goToHome(){
    this.router.navigate(['/home'])
  }
  goToLeaderboard(){
    this.router.navigate(['/leaderboard'])
  }
  goToEarn(){
    this.router.navigate(['/earn'])
  }

}
