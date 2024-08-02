import { CommonModule } from '@angular/common';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import axios from 'axios';
import { NgxLoadingModule } from 'ngx-loading';
import Swal from 'sweetalert2'
import { ApiService } from '../services/api.service';
import { GlobalDataService } from '../services/global.service';
import { map, pipe } from 'rxjs';

@Component({
	selector: 'app-leaderboard',
	standalone: true,
	imports: [CommonModule, NgxLoadingModule],
	templateUrl: './leaderboard.component.html',
	styleUrls: ['./leaderboard.component.scss']
})
export class LeaderboardComponent implements OnInit {
	isChecking = false;
	tabIndex: number = 1;

	userInfo: any;

	userPoint: any;
	listUsers: any;

	totalPoints: any;
	totalHolder: any;
	topRankUser: any[] = [];

	loading: boolean = false;

	constructor(
		private apiService: ApiService,
		private router: Router,
		private globalDataService: GlobalDataService
	) { }



	ngOnInit(): void {
		this.loadData();
	}

	getUserRanking() {
		this.userInfo = this.globalDataService.loadUserInfo();
		const data = {
			"limit": 1,
			"offset": 0,
			"user_id": this.userInfo.user.id
		}
		this.apiService.post(`leaderboard`, data, { 'Content-Type': 'application/json' }).subscribe((data: any) => {
			if (!data.data[0].avatar) {
				this.userPoint = { ...data.data[0], avatar: '../../assets/Avatar Image.png' }
			} else {
				this.userPoint = data.data[0]
			}
		})
	}

	getUserReferralRanking() {
		this.userInfo = this.globalDataService.loadUserInfo();
		const data = {
			"limit": 1,
			"offset": 0,
			"user_id": this.userInfo.user.id,
			"is_referral": true
		}
		this.apiService.post(`leaderboard`, data, { 'Content-Type': 'application/json' }).subscribe((data: any) => {
			if (!data.data[0].avatar) {
				this.userPoint = { ...data.data[0], avatar: '../../assets/Avatar Image.png' }
			} else {
				this.userPoint = data.data[0]
			}
		})
	}

	getReferralLeaderboard() {
		this.userInfo = this.globalDataService.loadUserInfo();
		const data = {
			"limit": 50,
			"offset": 0,
			"is_referral": true
		}
		this.apiService.post(`leaderboard`, data, { 'Content-Type': 'application/json' }).subscribe((data: any) => {
			this.updateLeaderBoardRank(data.data)
		})
	}

	loadData() {
		if (this.tabIndex == 1) {
			this.getLeaderboard();
			this.getUserRanking();
		} else {
			this.getUserReferralRanking()
			this.getReferralLeaderboard()

		}
	}
	// changeTab(nameOfTab: any) {
	// 	this.currentTab = nameOfTab
	// 	this.loadData()
	// }
	getLeaderboard() {
		this.isChecking = true;
		this.userInfo = this.globalDataService.loadUserInfo();
		const data = {
			"limit": 50,
			"offset": 0,
		}
		this.apiService.post(`leaderboard`, data, { 'Content-Type': 'application/json' }).subscribe((data: any) => {
			this.updateLeaderBoardRank(data.data)
		})
	}

	updateLeaderBoardRank(data: any) {
		let total = 0;
		this.listUsers = [];
		data.forEach((user: any) => {
			total += user.total_point;
			if (!user.avatar) {
				user.avatar = '../../assets/Avatar Image.png'
			}
			if (user.rank <= 3) {
				this.topRankUser.push(user);
			} else {
				this.listUsers.push(user);
			}
		});
		this.totalPoints = total;
		this.totalHolder = data.total;
		this.isChecking = false;
	}

	goToHome() {
		this.isChecking = true;
		setTimeout(() => {
			this.isChecking = false;
			this.router.navigate(['/home'])
		}, 300);
	}

	goToFriend() {
		this.isChecking = true;
		setTimeout(() => {
			this.isChecking = false;
			this.router.navigate(['/friend'])
		}, 300);
	}
	formatName(name: any) {
		return name && name == 'None' ? '' : name;
	}

	goToEarn() {
		this.router.navigate(['/earn'])
	}

	changeTab(tabIndex: number) {
		this.tabIndex = tabIndex;
		this.loadData();
	}
}
