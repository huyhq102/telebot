import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import axios from 'axios';
import { NgxLoadingModule } from 'ngx-loading';
import Swal from 'sweetalert2'
import { ApiService } from '../services/api.service';
import { GlobalDataService } from '../services/global.service';
import { MatBottomSheet, MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatProgressSpinnerModule, ProgressSpinnerMode } from '@angular/material/progress-spinner';
import { WheelComponent } from '../wheel/wheel.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, NgxLoadingModule, MatBottomSheetModule, MatProgressSpinnerModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  public loading: boolean = false;
  myInfo: any;
  constructor(
    private apiService: ApiService,
    private globalDataService: GlobalDataService,
		private _bottomSheet: MatBottomSheet,
    private router: Router
  ) { }

  totalActivePoint = 0;
  totalFriendPoint = 0;
  totalPoint = 0
  userInfo: any
  pointHistory: any

  followMode: ProgressSpinnerMode = 'determinate';
  value = 50;


  isChecking = false;
  isTick = false;
  ngOnInit(): void {
		// this.openBottomSheet();

    this.userInfo = this.globalDataService.loadUserInfo();
    this.getMyInfo()
    this.loadActivePoint()
    // this.loadTotalPoint()
  }

  loadActivePoint() {
    this.isChecking = true;

    const data = { user_id: this.userInfo.user.id };
    this.apiService.post('my-point', data, { 'Content-Type': 'application/json' }).subscribe((data: any) => {

      this.totalActivePoint = 0;
      this.totalFriendPoint = 0;

      data.forEach((element: any) => {
        if (element.entity_type === 0 || element.entity_type === 1 || element.entity_type === 2) {
          this.totalActivePoint += +element.sum
        } else {
          this.totalFriendPoint += +element.sum
        }
      });
      this.totalPoint = this.totalActivePoint + this.totalFriendPoint;
      this.isChecking = false;
    })
  }

  getMyInfo() {
		this.userInfo = this.globalDataService.loadUserInfo();
		const data = {
			"limit": 1,
			"offset": 0,
			"user_id": this.userInfo.user.id
		}
		const dataUser = {
			user_list:[this.userInfo.user.id]
		}
		
		this.apiService.post(`leaderboard`, data, { 'Content-Type': 'application/json' }).subscribe((data: any) => {
			if(!data.data[0].avatar){
				this.myInfo = {...data.data[0], avatar:'../../assets/Avatar Image.png'}
			}else{
				this.myInfo = data.data[0]
			}
		})
	}


  loadTotalPoint() {
    this.apiService.get('users').subscribe((response: any) => {
      this.pointHistory = response.data;
    })
  }

  gotoPage(page = '') {
    window.open(page)
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
      
    })
    // this.checkJoinInTelegram(groupId).then(status => {
    //     return status ? this.checkUserInGroup(groupId): true 
    // }).then(
    //   groupStatus => {
    //     if (groupStatus == false) {
    //       this.addGroup(groupId)
    //       this.addPoint(3000)
    //     } else {
    //       Swal.fire({
    //         title: "Oops!",
    //         text: "You have not joined group or got the reward!",
    //         icon: "success"
    //       });
    //     }
    //   }
    // ).finally(()=> {
    //   this.isChecking = false
    // })
    return true;
  }

  checkJoinInTelegram(groupId: any) {
    return new Promise(
      resolve => this.apiService.post('telegram-webhook-group',
        {
          "id": this.userInfo.user.id,
          "group_id": groupId
        },
        {
          "Content-Type": "application/json",
        }
      ).subscribe((response: any) => {
        response.message == 'User had joined group' ? resolve(true) : resolve(false)
      }))
  }

  followX() {
    window.open('https://x.com', '_blank')
    this.followMode = 'indeterminate';
    setTimeout(()=>{
      this.followMode = 'determinate';
    }, 10000)
  }

  addGroup(groupId: any) {
    const data = {
      "id": this.userInfo.user.id,
      "group_id": groupId
    }
    this.apiService.post('users/groups', data, {
      "Content-Type": "application/json",
    }).subscribe(() => { })
  }

  checkUserInGroup(groupId: any) {
    return new Promise(
      resolve => this.apiService.post(
        'is_user_in_group',
        {
          "id": this.userInfo.user.id,
          "group_id": groupId
        },
        {
          "Content-Type": "application/json"
        }
      ).subscribe((response: any) => {
        if (response.message == 'User is not a member') {
          return resolve(false)
        } else {
          return resolve(true)
        }
      })
    )
  }

  addPoint(point: any) {
    const data = {
      "id": this.userInfo.user.id,
      "points": point
    }

    this.apiService.post('users/points', data, {
      "Content-Type": "application/json",
    }).subscribe((response) => {
      Swal.fire({
        title: "OK!",
        text: "You got a reward!",
        icon: "success"
      });
      this.loadActivePoint()
    })
  }

  //   goToHome(){
  //     this.router.navigate(['/home'])
  //   }
  goToLeaderboard() {
    this.isChecking = true;
    setTimeout(() => {
      this.isChecking = false;
      this.router.navigate(['/leaderboard'])
    }, 300);
  }

  goToFriends() {
    this.isChecking = true;
    setTimeout(() => {
      this.isChecking = false;
      this.router.navigate(['/friend'])
    }, 300);
  }
    goToEarn(){
      this.router.navigate(['/earn'])
    }

	openBottomSheet(): void {
    this._bottomSheet.open(WheelComponent);
    }

}
