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
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, NgxLoadingModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  public loading: boolean = false;
  constructor(
    private apiService: ApiService,
    private globalDataService: GlobalDataService
  ) { }

  totalActivePoint = 0;
  totalPoint = 0
  userInfo: any
  pointHistory: any

  isChecking = false;
  ngOnInit(): void {
    this.userInfo = this.globalDataService.loadUserInfo()

    this.loadActivePoint()

    // this.loadTotalPoint()
  }

  loadActivePoint() {
    this.loading = true
    this.apiService.get(`users/${this.userInfo?.user?.id}`).subscribe(data => {
      this.totalActivePoint = Number(data);
      this.totalPoint = this.totalActivePoint;
      this.loading = false
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


  check(groupId: any) {
    this.isChecking = true;
    this.checkJoinInTelegram(groupId).then(status => {
        return status ? this.checkUserInGroup(groupId): true 
    }).then(
      groupStatus => {
        if (groupStatus == false) {
          this.addGroup(groupId)
          this.addPoint(3000)
        } else {
          Swal.fire({
            title: "Oops!",
            text: "You have not joined group or got the reward!",
            icon: "success"
          });
        }
      }
    ).finally(()=> {
      this.isChecking = false
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

  addGroup(groupId: any) {
    const data = {
      "id": this.userInfo.user.id,
      "group_id": groupId
    }
    this.apiService.post('users/groups', data, {
      "Content-Type": "application/json",
    }).subscribe(()=>{})
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
    
    this.apiService.post('users/points',data, {
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
}
