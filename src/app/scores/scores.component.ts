import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { TelegramWebappService } from '@zakarliuka/ng-telegram-webapp';
import { HttpClient } from '@angular/common/http';
import axios from 'axios';

@Component({
  selector: 'app-scores',
  templateUrl: './scores.component.html',
  styleUrls: ['./scores.component.scss']
})
export class ScoresComponent implements OnInit {
  private readonly telegramService = inject(TelegramWebappService);

  constructor(private router:Router, private httpClient: HttpClient) { }


  ngOnInit() {

    const tg = (window as any).Telegram.WebApp;
    tg.ready();
    tg.expand();

    const userInfo = tg.initDataUnsafe;

    if (
      userInfo?.user?.id &&
      userInfo?.user?.last_name &&
      userInfo?.user?.first_name
    ) {
          const data = {
            id: userInfo?.user?.id,
            first_name: userInfo?.user?.last_name,
            last_name: userInfo?.user?.first_name,
          };

          let config = {
            method: "post",
            maxBodyLength: Infinity,
            url: "https://my-first-project-production-9b2c.up.railway.app/users",
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
              console.log(error);
            });
    } else {
      console.error("Cannot get user information:", userInfo);
    }
  }

  
  gotoHome() {
    this.router.navigate(['/home'])
  }
}
