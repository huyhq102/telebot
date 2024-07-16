import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import axios from 'axios';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private httpClient: HttpClient, private router: Router) { }

  totalActivePoint = 0;
  totalPoint = 0
  userInfo: any
  pointHistory: any
  ngOnInit(): void {
    this.loadActivePoint()
    this.loadTotalPoint()
  }

  loadActivePoint() {
    const tg = (window as any).Telegram.WebApp;
    tg.ready();
    tg.expand();

    this.userInfo = tg.initDataUnsafe;

    this.httpClient.get(`https://my-first-project-production-9b2c.up.railway.app/users/${this.userInfo?.user?.id}`).pipe().subscribe(data => {
      this.totalActivePoint = Number(data);
      this.totalPoint = this.totalActivePoint;
    })
  }

  loadTotalPoint() {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: "https://my-first-project-production-9b2c.up.railway.app/users",
    };

    axios.request(config).then(response => {
      this.pointHistory = response.data;
      // this.totalPoint = response.data.reduce((total: any, obj: { points: any; }) => obj.points + total, 0);
    })
  }

  gotoPage(page = '') {
    window.open(page)
  }


  check(groupId: any) {
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
          title: "Oh no!",
          text: "Chưa tham gia nhóm hoặc đã nhận thưởng!",
          icon: "success"
        });
      }
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
      url: "https://my-first-project-production-9b2c.up.railway.app/telegram-webhook-group",
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
      url: "https://my-first-project-production-9b2c.up.railway.app/users/groups",
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        // alert(JSON.stringify(response.data))
      })
      .catch((error) => {
        // alert(error);
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
      url: "https://my-first-project-production-9b2c.up.railway.app/is_user_in_group",
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
      url: "https://my-first-project-production-9b2c.up.railway.app/users/points",
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        Swal.fire({
          title: "Good job!",
          text: "Bạn đã nhận được điểm thưởng!",
          icon: "success"
        });
        this.loadActivePoint()
        this.loadTotalPoint()    
      })
      .catch((error) => {
      });
  }
}
