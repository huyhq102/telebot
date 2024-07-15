import { Component, inject } from '@angular/core';
import { TelegramWebappService } from '@zakarliuka/ng-telegram-webapp';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'telebot';
  private readonly telegramService = inject(TelegramWebappService);
  constructor(private httpClient: HttpClient) { }

  ngOnInit() {
    const tg: any = this.telegramService.initDataUnsafe;
    tg.ready();
    tg.expand();
    let data;

    const initData = tg.initData;
    console.log("initData:", initData);
    const initDataUnsafe = tg.initDataUnsafe;
    console.log("initDataUnsafe:", initDataUnsafe);
    if (
      initDataUnsafe?.user?.id &&
      initDataUnsafe?.user?.last_name &&
      initDataUnsafe?.user?.first_name
    ) {
         data =JSON.stringify({
            id: initDataUnsafe?.user?.id,
            first_name: initDataUnsafe?.user?.last_name,
            last_name: initDataUnsafe?.user?.first_name,
          });
      console.log("initDataUnsafe:", initDataUnsafe);
    } else {
      console.error("Cannot get user information:", initDataUnsafe);
    }
    this.httpClient.post('https://my-first-project-production-9b2c.up.railway.app/telegram-webhook', data).subscribe(console.log)
    console.log("HII", );

    this.httpClient.get( `https://my-first-project-production-9b2c.up.railway.app/users/${initDataUnsafe?.user?.id}`)
  }


}
