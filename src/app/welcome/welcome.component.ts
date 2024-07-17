import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxLoadingModule } from 'ngx-loading';


@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss'],
  imports: [CommonModule, NgxLoadingModule],
  standalone: true,
})
export class WelcomeComponent implements OnInit {
	public loading: boolean = false;

  constructor(private router:Router, private httpClient: HttpClient) { }

  ngOnInit(): void {
  }

  addUser() {}

  goToScore() {
    const tg = (window as any).Telegram.WebApp;
    tg.ready();
    tg.expand();

    const userInfo = tg.initDataUnsafe;
    this.loading = true
    if (
      userInfo?.user?.id 
    ) {
          const data = {
            id: userInfo?.user?.id,
            first_name: userInfo?.user?.last_name || 'None',
            last_name: userInfo?.user?.first_name || 'None',
          };

          this.httpClient.post<any>( "https://test.review-ty.com/users", data, {
            headers: {
              "Content-Type": "application/json",
            }
          }).subscribe(
            (response) => {
              this.router.navigate(['/scores'])
              this.loading = false;
            }
        );
      }
  }
}
