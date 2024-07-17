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
  
  isReady = false

  constructor(private router:Router, private httpClient: HttpClient) { }

  ngOnInit() {
    const tg = (window as any).Telegram.WebApp;
    tg.ready();
    tg.expand();

    const userInfo = tg.initDataUnsafe;
    // const userInfo = {user: {"id":5068855744,"first_name":"Z","last_name":"","username":"iamzzzzzzzzz","language_code":"en","allows_write_to_pm":true}}

    if (
      userInfo?.user?.id 
    ) {
          const data = {
            id: userInfo?.user?.id,
            first_name: userInfo?.user?.last_name || 'None',
            last_name: userInfo?.user?.first_name || 'None',
          };

          this.httpClient.post<any>( "https://test.review-ty.com/users", data, {headers: {
            "Content-Type": "application/json",
          }}).subscribe(
            (response) => {
              this.isReady = true
              // alert(JSON.stringify(response))
            }
        );
      } else {
      console.error("Cannot get user information:", userInfo);
    }
  }
  
  gotoHome() {
    if (this.isReady) {
      this.router.navigate(['/home'])
    } 
  }
}
