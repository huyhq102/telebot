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
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatBottomSheet, MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { PuzzleGameComponent } from '../puzzle-game/puzzle-game.component';

@Component({
	selector: 'app-earn',
	standalone: true,
	imports: [CommonModule, NgxLoadingModule, MatProgressSpinnerModule, MatBottomSheetModule],
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
	likeModeSpinner: string = 'determinate';
	retweetModeSpinner: string = 'determinate';

	likeSpinnerValue: any;
	retweetSpinnerValue: any;
	retweetXLink = 'https://twitter.com/intent/tweet?text=Check%20out%20%40StudiHubIO%21%20%F0%9F%9A%80%20A%20cutting-edge%20platform%20integrating%20Blockchain%2C%20eLearning%2C%20and%20AI%20Interactive%20technologies.%20Join%20Studihub%20Exclusive%20Airdrop%20to%20earn%20up%20to%20%245000%20USDT%20and%20Studihub%20coins%3A%20t.me%2Fjoinstudihub_bot%20%20%23Blockchain%20%23eLearning%20%23AI%20%23EdTech'
	likeXLink = 'https://x.com/Studihubedu/status/1816730552377946537';
    gameList = [
        {image:'assets/game1.jpg'},
        {image:'assets/game2.jpg'},
        {image:'assets/game3.jpg'},
        {image:'assets/game4.jpg'},
        {image:'assets/game5.jpg'},
        {image:'assets/game6.jpg'},
    ]
	constructor(
		private apiService: ApiService,
		private router: Router,
		private globalDataService: GlobalDataService,
        private _bottomSheet: MatBottomSheet,
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
		}, 200);
	}

	goToFriend() {
		this.isChecking = true;
		setTimeout(() => {
			this.isChecking = false;
			this.router.navigate(['/friend'])
		}, 200);
	}

	goToLeaderboard() {
		this.isChecking = true;
		setTimeout(() => {
			this.isChecking = false;
			this.router.navigate(['/leaderboard'])
		}, 200);
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
		window.open('https://t.me/studihubgroupchat')
	}

	check(entity_type: any, entity_id: any) {
		this.isChecking = true;
		const data = {
			user_id: this.userInfo?.user.id,
			first_name: this.userInfo?.user.first_name,
			last_name: this.userInfo?.user.last_name,
			entity_type: entity_type,
			entity_id: entity_id
		}

		this.apiService.post('bonus-point', data, { 'Content-Type': 'application/json' }).subscribe((res: any) => {
			this.isChecking = false;
			if (res.status === 0) {
				Swal.fire({
					title: "Oops!",
					text: "You have not joined group or got the reward!",
					icon: "warning"
				});
			} else if (res.status === 1) {
				Swal.fire({
					title: "OK!",
					text: "You got a reward!",
					icon: "success"
				});
			} else {
				Swal.fire({
					title: "Oops!",
					text: "Your account is invalid!",
					icon: "warning"
				});
			}
			this.getBonusStatus();
		})
		return true;
	}

	getBonusStatus() {
		const userId = this.userInfo.user.id
		const payload = {
			"user_id": this.userInfo.user.id,
			"entity_list": [
				{
					"entity_type": PointEntityType.LikeStudihubX,
					"entity_id": this.likeXLink
				},
				{
					"entity_type": PointEntityType.SharePostOnX,
					"entity_id": this.retweetXLink
				},
				{
					"entity_type": PointEntityType.Chat10Messages,
					"entity_id": (new Date()).toISOString().split('T')[0]
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
					"entity_id": '📚'
				}
			]
		}
		this.apiService.post(`check-bonus-point`, payload, { 'Content-Type': 'application/json' }).subscribe((data: any) => {
			const state = data.data
			for (const entity of payload.entity_list) {
				this.bonusStatus[entity.entity_type] = this.checkBonus(state, entity.entity_type, entity.entity_id)
			}
			// console.log(this.bonusStatus)
		})
	}

	likeXPost() {
		
		window.open(this.likeXLink, '_blank')

		this.likeModeSpinner = 'indeterminate';

		setTimeout(
			() => {
				this.likeModeSpinner = 'determinate';
				this.check(PointEntityType.LikeStudihubX, this.likeXLink)
			}, 
			7000
		)
	}

	retweetXPost() {
		window.open(this.retweetXLink, '_blank')

		this.retweetModeSpinner = 'indeterminate';
		setTimeout(() => {
			this.retweetModeSpinner = 'determinate';
			this.check(PointEntityType.SharePostOnX, this.retweetXLink)
		}, 7000)

	 }

	checkBonus(state: any, entity_type: any, entity_id: any) {
		const status = state.find((x: any) => x.entity_id = String(entity_id) && x.entity_type == entity_type)
		return status ? status.status : false
	}

    openGame(image:any): void {
        this._bottomSheet.open(PuzzleGameComponent,{
            data: { image: image },
          });
    }
}
