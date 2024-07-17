import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { TelegramWebappService } from '@zakarliuka/ng-telegram-webapp';
import { HttpClient } from '@angular/common/http';
import axios from 'axios';
import { CommonModule } from '@angular/common';
import { NgxLoadingModule } from 'ngx-loading';

@Component({
  selector: 'app-scores',
  templateUrl: './scores.component.html',
	standalone: true,
	imports: [CommonModule,NgxLoadingModule],
  styleUrls: ['./scores.component.scss']
})
export class ScoresComponent implements OnInit {
	public loading: boolean = false;
  

  constructor(private router:Router, private httpClient: HttpClient) { }

  ngOnInit() {
  }
  
  gotoHome() {
    this.loading = true;
		setTimeout(() => {
			this.loading = false;
      this.router.navigate(['/home'])
		}, 1000);
  }
}
