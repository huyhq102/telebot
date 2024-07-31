import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxLoadingModule } from 'ngx-loading';
import { GlobalDataService } from '../services/global.service';
import { ApiService } from '../services/api.service';
import axios from 'axios';


@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss'],
  imports: [CommonModule, NgxLoadingModule],
  standalone: true,
})
export class WelcomeComponent implements OnInit {
  public loading: boolean = false;
  userInfo: any;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private apiService: ApiService,
    private globalDataService: GlobalDataService
  ) { }

  ngOnInit(): void {
    this.userInfo = this.globalDataService.loadUserInfo();
    if (this.userInfo.start_param) {
      const data = {
        user_id: this.userInfo.start_param,
        last_name: this.userInfo.user.last_name,
        first_name: this.userInfo.user.first_name,
        entity_type: 3,
        entity_id: this.userInfo.user.id
      }
      this.apiService.post('bonus-point',data,{"Content-Type": "application/json"}).subscribe()  
    }
  }

  addUser() { }

  goToScore() {
    this.router.navigate(['/scores'])
    this.loading = true
    if (
      this.userInfo?.user?.id
    ) {
      const data = {
        user_id : this.userInfo?.user?.id,
        first_name: this.userInfo?.user?.first_name || '',
        last_name: this.userInfo?.user?.last_name || '',
      };

      this.apiService.post("start-app", data, {"Content-Type": "application/json"}).subscribe(
        (response: any) => {
          this.loading = false;
          if (response.status == 0) {
            this.router.navigate(['/home'])
          } else {
            this.router.navigate(['/scores'])
          }
        }
      );
    }
  }
}
