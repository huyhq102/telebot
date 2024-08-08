import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import axios from 'axios';

import Swal from 'sweetalert2'
import { NgxLoadingModule } from 'ngx-loading';
import { DeviceDetectorService } from 'ngx-device-detector';

import { ApiService } from '../services/api.service';
import { GlobalDataService } from '../services/global.service';
import { MatBottomSheet, MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatProgressSpinnerModule, ProgressSpinnerMode } from '@angular/material/progress-spinner';
import { WheelComponent } from '../wheel/wheel.component';
import { ModalComponent } from '../modal/modal.component';
import { WalletComponent } from '../wallet/wallet.component';

const { ethers } = require('ethers');
import { Web3 } from 'web3';
import { WalletService } from '../services/wallet.service';
// import { MetamaskWalletService } from '../services/metamask-wallet.service';
// const Web3 = require("web3");

declare let window: any;

// const { ethers } = require('ethers');


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
    private walletService: WalletService,
    private router: Router,
    private deviceService: DeviceDetectorService
  ) { }

  walletAddress: any

  totalActivePoint = 0;
  totalFriendPoint = 0;
  totalPoint = 0
  userInfo: any
  pointHistory: any
  bonusStatus: any = {};

  followMode: ProgressSpinnerMode = 'determinate';
  joinStudihubGroupMode: ProgressSpinnerMode = 'determinate';
  subcribeStudihubChannelMode: ProgressSpinnerMode = 'determinate';

  value = 50;

  walletTxtMode = 'Connect Wallet';
  isChecking = false;
  isTick = false;

  ngOnInit(): void {
    // this.openBottomSheet();
    this.userInfo = this.globalDataService.loadUserInfo();
    this.getMyInfo()
    this.loadActivePoint()
    this.getBonusStatus()

    this.walletService.getAccount().then(account => { this.walletAddress = account })
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
      user_list: [this.userInfo.user.id]
    }

    this.apiService.post(`leaderboard`, data, { 'Content-Type': 'application/json' }).subscribe((data: any) => {
      if (!data.data[0].avatar) {
        this.myInfo = { ...data.data[0], avatar: '../../assets/Avatar Image.png' }
      } else {
        this.myInfo = data.data[0]
      }
    })
  }

  getBonusStatus() {
    const payload = {
      "user_id": this.userInfo.user.id,
      "entity_list": [
        {
          "entity_type": 1,
          "entity_id": "-1002188041826"
        },
        {
          "entity_type": 2,
          "entity_id": "-1002206293719"
        },
        {
          "entity_type": 4,
          "entity_id": "https://x.com/Studihubedu"
        },
        {
          "entity_type": 11,
          "entity_id": (new Date()).toISOString().split('T')[0]
        }
      ]
    }
    this.apiService.post(`check-bonus-point`, payload, { 'Content-Type': 'application/json' }).subscribe((data: any) => {
      const state = data.data

      this.bonusStatus.subcribeStudihubChannel = this.checkBonus(state, 2, '-1002206293719')
      this.bonusStatus.joinStudihubGroup = this.checkBonus(state, 1, '-1002188041826')
      this.bonusStatus.followX = this.checkBonus(state, 4, 'https://x.com/Studihubedu')
      this.bonusStatus.spinLuckyWheelDaily = this.checkBonus(state, 11, (new Date()).toISOString().split('T')[0])
      if (this.bonusStatus.spinLuckyWheelDaily == false) {
        this._bottomSheet.open(WheelComponent);
      }
      console.log(this.bonusStatus)
    })
  }

  checkBonus(state: any, entity_type: any, entity_id: any) {
    const status = state.find((x: any) => x.entity_id = String(entity_id) && x.entity_type == entity_type)
    return status ? status.status : false
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
      this.getBonusStatus();
    })
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
    window.open('https://x.com/Studihubedu', '_blank')
    this.followMode = 'indeterminate';
    setTimeout(() => {
      this.followMode = 'determinate';
      this.check(4, 'https://x.com/Studihubedu')
    }, 7000)
  }

  addFollowPointOnX() {

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
    },
      200
    );
  }

  goToFriends() {
    this.isChecking = true;
    setTimeout(() => {
      this.isChecking = false;
      this.router.navigate(['/friend'])
    }, 200);
  }

  goToEarn() {
    this.router.navigate(['/earn'])
  }

  openBottomSheet(): void {
    this._bottomSheet.open(ModalComponent);
  }

  openWalletSheet(): void {
    this._bottomSheet.open(WalletComponent);
  }

  async loginWithCoin98() {
    if (this.walletTxtMode == 'Verify your wallet') {
      this.checkWallet()
    } else {
      if (this.deviceService.isDesktop()) {
        this.walletService.loginCoin98Wallet().then(async () => {
          this.walletAddress = await this.walletService.getAccount()
        })
      } else {
        this.openWalletSheet()
        this.walletTxtMode = 'Verify your wallet'
      }
    }
  }

  logoutWallet() {
    const data = {
      user_id: this.userInfo.user.id 
    }
    this.apiService.post(`logout-wallet`, data, { 'Content-Type': 'application/json' }).subscribe((data: any) => {
      this.walletService.removeKey()
      this.walletAddress = undefined
    })
  }

  checkWallet() {
    const data = {
      "limit": 1,
      "offset": 0,
      "user_id": this.userInfo.user.id
    }

    this.apiService.post(`leaderboard`, data, { 'Content-Type': 'application/json' }).subscribe((data: any) => {
      // alert(JSON.stringify(data))
      if (data.data[0].wallet_address) {
        this.walletAddress = data.data[0].wallet_address
      }
    })
  }
}
