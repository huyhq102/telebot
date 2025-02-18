import { CommonModule } from '@angular/common';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import axios from 'axios';
import { NgxLoadingModule } from 'ngx-loading';
import Swal from 'sweetalert2'
import { ApiService } from '../services/api.service';
import { GlobalDataService } from '../services/global.service';

@Component({
	selector: 'app-leaderboard',
	standalone: true,
	imports: [CommonModule, NgxLoadingModule],
	templateUrl: './leaderboard.component.html',
	styleUrls: ['./leaderboard.component.scss']
})
export class LeaderboardComponent implements OnInit {
	isChecking = false;

	userInfo: any;

	userPoint: any;
	listUsers: any;
	
	totalPoints: any;
	totalHolder: any

	public loading: boolean = false;
	constructor(
		private apiService: ApiService,
		private router: Router,
		private globalDataService: GlobalDataService
	) { }



	ngOnInit(): void {
		this.getDataUser();
		this.getListUser();
	}

	getDataUser() {
		this.userInfo = this.globalDataService.loadUserInfo();
		const data = {
			"limit": 1,
			"offset": 0,
			"user_id": this.userInfo.user.id
		}
		this.apiService.post(`leaderboard`, data, { 'Content-Type': 'application/json' }).subscribe((data: any) => {
			this.userPoint = data.data
		})
	}

	getListUser() {
		this.userInfo = this.globalDataService.loadUserInfo();
		const data = {
			"limit": 50,
			"offset": 0,
		}
		this.apiService.post(`leaderboard`, data, { 'Content-Type': 'application/json' }).subscribe((data: any) => {
			this.listUsers = data.data;
			let total = 0
			data.data.forEach((user: any) => {
				total += user.total_point
			});
			this.totalPoints = total;
			this.totalHolder = data.total
		})
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
}
