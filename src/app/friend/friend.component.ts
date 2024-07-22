import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import axios from 'axios';
import { NgxLoadingModule } from 'ngx-loading';
import Swal from 'sweetalert2'
import { ApiService } from '../services/api.service';
import { GlobalDataService } from '../services/global.service';

@Component({
  selector: 'app-friend',
	standalone: true,
	imports: [CommonModule,NgxLoadingModule],
  templateUrl: './friend.component.html',
  styleUrls: ['./friend.component.scss']
})
export class FriendComponent implements OnInit {

	public loading: boolean = false;
	listFriends: any;
	isChecking = false;
	userInfo: any;
	inviteLink: any;
  constructor(private apiService: ApiService, 
		private router: Router,
		private globalDataService: GlobalDataService) { }
  ngOnInit(): void {
    this.getListFriends()
  }
	getListFriends(){
		this.userInfo = this.globalDataService.loadUserInfo();
		this.inviteLink = 'https://t.me/rvt_ma_bot/app?startapp='+this.userInfo.user.id
		const data = {
			"user_id": this.userInfo.user.id,
		}
		this.apiService.post(`friend-point`,data, {'Content-Type': 'application/json'}).subscribe(data=>{
			this.listFriends = data;
		})
	}

  goToHome(){
    this.isChecking =true;
		setTimeout(() => {
			this.isChecking = false;
      this.router.navigate(['/home'])
		}, 1000);
  }
  goToLeaderboard(){
    this.isChecking =true;
		setTimeout(() => {
			this.isChecking = false;
      this.router.navigate(['/leaderboard'])
		}, 1000);
  }
  goToEarn(){
    this.router.navigate(['/earn'])
  }

}
