import { CommonModule } from '@angular/common';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import axios from 'axios';
import { NgxLoadingModule } from 'ngx-loading';
import Swal from 'sweetalert2'
import { ApiService } from '../services/api.service';
import { GlobalDataService } from '../services/global.service';
import { PointEntityType } from '../services/point-type';

@Component({
	selector: 'app-earn',
	standalone: true,
	imports: [CommonModule, NgxLoadingModule],
	templateUrl: './earn.component.html',
	styleUrls: ['./earn.component.scss']
})
export class EarnComponent implements OnInit {
	isChecking = false;

	userInfo: any;

	userPoint: any;
	listUsers: any;

	totalPoints: any;
	totalHolder: any;
	tabIndex: number = 1;
	tabIndexSocial: number = 1;
	isMiniGanme: boolean = false;
	isComming: boolean = true;

	public loading: boolean = false;
	bonusStatus: any = {};
	constructor(
		private apiService: ApiService,
		private router: Router,
		private globalDataService: GlobalDataService
	) { }



	ngOnInit(): void {
		this.userInfo = this.globalDataService.loadUserInfo();
		this.getDataUser();
		this.getListUser();
		this.getBonusStatus()
	}

	getDataUser() {
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

	goToLeaderboard() {
		this.isChecking = true;
		setTimeout(() => {
			this.isChecking = false;
			this.router.navigate(['/leaderboard'])
		}, 300);
	}
	formatName(name: any) {
		return name && name == 'None' ? '' : name;
	}

	changeTab(tabIndex: number) {
		this.tabIndex = tabIndex;
		if (tabIndex === 2) {
			this.isMiniGanme = true;
		} else {
			this.isMiniGanme = false;
		}
	}

	changeTabSocial(tabIndex: number) {
		this.tabIndexSocial = tabIndex;
		if (tabIndex === 1) {
			this.isComming = true;
		} else {
			this.isComming = false;
		}
	}

	likeXPost() {
		window.open('https://x.com/Studihubedu/status/1818137149784396281', '_blank')
	}

	retweetXPost() { }

	copyIcon() {
		const selBox = document.createElement('textarea');
		selBox.style.position = 'fixed';
		selBox.style.left = '0';
		selBox.style.top = '0';
		selBox.style.opacity = '0';
		selBox.value = '📚';
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

	gotoStudihubGroup() {
		window.open('https://t.me/studihubedu')
	}

	getBonusStatus() {
		const userId = this.userInfo.user.id
		const payload = {
			"user_id": this.userInfo.user.id,
			"entity_list": [
				{
					"entity_type": PointEntityType.LikeStudihubX,
					"entity_id": 'https://x.com/Studihubedu/status/1818137149784396281'
				},
				{
					"entity_type": PointEntityType.SharePostOnX,
					"entity_id": "https://x.com/Studihubedu/status/1818137149784396281"
				},
				{
					"entity_type": PointEntityType.Chat10Messages,
					"entity_id": userId
				},
				{
					"entity_type": PointEntityType.Tag3MembersOnPinnedMessage,
					"entity_id": userId
				},
				{
					"entity_type": PointEntityType.Add3Friends,
					"entity_id": userId
				},
				{
					"entity_type": PointEntityType.GotIconOnTelegramName,
					"entity_id": userId
				}
			]
		}
		this.apiService.post(`check-bonus-point`, payload, { 'Content-Type': 'application/json' }).subscribe((data: any) => {
			const state = data.data
			for (const entity of payload.entity_list) {
				this.bonusStatus[entity.entity_type] = this.checkBonus(state, entity.entity_type, entity.entity_id)

			}
			console.log(this.bonusStatus)
		})
	}

	checkBonus(state: any, entity_type: any, entity_id: any) {
		const status = state.find((x: any) => x.entity_id = String(entity_id) && x.entity_type == entity_type)
		return status ? status.status : false
	}


}
