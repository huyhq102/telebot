import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxLoadingModule } from 'ngx-loading';
import Swal from 'sweetalert2'
import { ApiService } from '../services/api.service';
import { GlobalDataService } from '../services/global.service';

@Component({
	selector: 'app-friend',
	standalone: true,
	imports: [CommonModule, NgxLoadingModule],
	templateUrl: './friend.component.html',
	styleUrls: ['./friend.component.scss']
})
export class FriendComponent implements OnInit {

	public loading: boolean = false;
	listFriends: any;
	isChecking = false;
	userInfo: any;
	inviteLink: any;
	forwardToTelegramFriend: string | undefined;
	myInfo: any;
	myReferrals: any;

	constructor(private apiService: ApiService,
		private router: Router,
		private globalDataService: GlobalDataService) { }
	ngOnInit(): void {
		this.getMyReferrals()
		this.getListFriends()
	}
	getListFriends() {
		this.userInfo = this.globalDataService.loadUserInfo();
		// this.inviteLink = 'https://t.me/rvt_ma_bot/app?startapp='+this.userInfo.user.id
		this.inviteLink = 'https://t.me/joinstudihub_bot/app?startapp=' + this.userInfo.user.id

		this.forwardToTelegramFriend = `https://t.me/share/url?url=${encodeURIComponent(this.inviteLink)}`
		const data = {
			"user_id": this.userInfo.user.id,
		}
		this.apiService.post(`friend-point`, data, { 'Content-Type': 'application/json' }).subscribe(data => {
			this.listFriends = data;
		})
	}

	getMyReferrals() {
		this.userInfo = this.globalDataService.loadUserInfo();
		const data = {
			"limit": 1,
			"offset": 0,
			"user_id": this.userInfo.user.id
		}
		const dataUser = {
			user_list:[this.userInfo.user.id]
		}

		this.apiService.post('referrals',dataUser,{ 'Content-Type': 'application/json' }).subscribe((response:any) =>{
			console.log('data',data)
			this.myReferrals = response.data[this.userInfo.user.id]
		})
		
		this.apiService.post(`leaderboard`, data, { 'Content-Type': 'application/json' }).subscribe((data: any) => {
			if(!data.data[0].avatar){
				this.myInfo = {...data.data[0], avatar:'../../assets/Avatar Image.png'}
			}else{
				this.myInfo = data.data[0]
			}
			console.log(data)
		})
	}

	formatName(name: any) {
		return name && name == 'None' ? '' : name;
	}
	goToHome() {
		this.isChecking = true;
		setTimeout(() => {
			this.isChecking = false;
			this.router.navigate(['/home'])
		}, 300);
	}
	goToLeaderboard() {
		this.isChecking = true;
		setTimeout(() => {
			this.isChecking = false;
			this.router.navigate(['/leaderboard'])
		}, 300);
	}
	goToEarn() {
		this.router.navigate(['/earn'])
	}

	copyInvitedLink() {
		const selBox = document.createElement('textarea');
		selBox.style.position = 'fixed';
		selBox.style.left = '0';
		selBox.style.top = '0';
		selBox.style.opacity = '0';
		selBox.value = this.inviteLink;
		document.body.appendChild(selBox);
		selBox.focus();
		selBox.select();
		document.execCommand('copy');
		document.body.removeChild(selBox);
		Swal.fire({
			text: "Copied successfully!",
			position: "top",
			showConfirmButton: false,
			padding: "0 0 1em",
			timer: 1000
		});
	}

}
