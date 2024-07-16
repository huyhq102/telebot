import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import axios from 'axios';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private httpClient: HttpClient, private router: Router) { }

  totalActivePoint = 0;
  totalPoint = 0

  ngOnInit(): void {
    this.loadActivePoint()
    this.loadTotalPoint()
  }

  loadActivePoint() {
    const tg = (window as any).Telegram.WebApp;
    tg.ready();
    tg.expand();

    const userInfo = tg.initDataUnsafe;

    this.httpClient.get(`https://my-first-project-production-9b2c.up.railway.app/users/${userInfo?.user?.id}`).pipe().subscribe(data => {
      this.totalActivePoint = Number(data);
    })
  }

  loadTotalPoint() {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: "https://my-first-project-production-9b2c.up.railway.app/users",
    };

    axios.request(config).then(response => {
      this.totalPoint = response.data.reduce((total: any, obj: { points: any; }) => obj.points + total, 0);
    })
  }

  gotoPage(page = '') {
    window.open(page)
  }
}
