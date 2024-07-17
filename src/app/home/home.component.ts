import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import axios from 'axios';
import { NgxLoadingModule } from 'ngx-loading';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-home',
	standalone: true,
	imports: [CommonModule,NgxLoadingModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

	public loading: boolean = false;
  constructor(private httpClient: HttpClient, private router: Router) { }

  totalActivePoint = 0;
  totalPoint = 0
  userInfo: any
  pointHistory: any

  isChecking = false;
  ngOnInit(): void {
    this.loadActivePoint()
    // this.loadTotalPoint()
  }

  loadActivePoint() {
		this.loading = true
    const tg = (window as any).Telegram.WebApp;
    tg.ready();
    tg.expand();

    this.userInfo = tg.initDataUnsafe;

    this.httpClient.get(`https://test.review-ty.com/users/${this.userInfo?.user?.id}`).pipe().subscribe(data => {
      this.totalActivePoint = Number(data);
      this.totalPoint = this.totalActivePoint;
			this.loading = false
    })
  }

  loadTotalPoint() {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: "https://test.review-ty.com/users",
    };

    axios.request(config).then(response => {
      this.pointHistory = response.data;
    })
  }

  gotoPage(page = '') {
    window.open(page)
  }


  check(groupId: any) {
    this.isChecking = true;

    this.checkJoinInTelegram(groupId).then(status => {
      if (status) {
        return this.checkUserInGroup(groupId)
      }
      return true;
    }).then(groupStatus => {
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
      this.isChecking = false
    })
  }

  checkJoinInTelegram(groupId: any) {
    const data = {
      "id": this.userInfo.user.id,
      "group_id": groupId
    }

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://test.review-ty.com/telegram-webhook-group",
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    return axios
      .request(config)
      .then((response) => {
        if (response.data.message == 'User had joined group') {
          return true
        }
        return false
      }).catch(error => {
        return false
      })
  }

  addGroup(groupId: any) {
    const data = {
      "id": this.userInfo.user.id,
      "group_id": groupId
    }

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://test.review-ty.com/users/groups",
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
      })
      .catch((error) => {
      });
  }

  checkUserInGroup(groupId: any) {
    const data = {
      "id": this.userInfo.user.id,
      "group_id": groupId
    }

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://test.review-ty.com/is_user_in_group",
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    return axios
      .request(config)
      .then((response) => {
        if (response.data.message == 'User is not a member') {
          return false
        }
        return true
      })
      .catch((error) => {
        return true;
      });
  }


  addPoint(point: any) {
    const data = {
      "id": this.userInfo.user.id,
      "points": point
    }

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://test.review-ty.com/users/points",
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        Swal.fire({
          title: "OK!",
          text: "You got a reward!",
          icon: "success"
        });
        this.loadActivePoint()
      })
      .catch((error) => {
      });
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
