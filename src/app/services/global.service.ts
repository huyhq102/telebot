import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class GlobalDataService {
userInfo: any;

constructor(private http: HttpClient) {}

    loadUserInfo() {
        // return {
        //     user: {
        //         id: '1986768325',
        //         first_name: 'Nguyen',
        //         last_name: 'Son'    
        //     },
        //      start_param: '1804277515'
        // }

        if (this.userInfo) {
            return this.userInfo;
        } else {
            const tg = (window as any).Telegram.WebApp;

            tg.ready();
            tg.expand();
            
            this.userInfo = tg.initDataUnsafe;

            return this.userInfo
        }
    }
}