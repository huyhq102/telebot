import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable()
export class GlobalDataService {
userInfo: any;

constructor(private http: HttpClient) {}

    loadUserInfo() {
        if (environment.production == false) {
            return {
                user: {
                    id: '1893048886',
                    first_name: '📚Son',
                    last_name: 'Nguyen'    
                },
                 start_param: '1893048886'
            }
        }
        // return {
        //     user: {
        //         id: '5976804079',
        //         first_name: 'Megamind',
        //         last_name: ''    
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