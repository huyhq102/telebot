import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WelcomeComponent } from './welcome/welcome.component';
import { HomeComponent } from './home/home.component';
import { ScoresComponent } from './scores/scores.component';
import { FriendComponent } from './friend/friend.component';
import { LeaderboardComponent } from './leaderboard/leaderboard.component';
import { EarnComponent } from './earn/earn.component';
import { WalletConnectComponent } from './wallet-connect/wallet-connect.component';

const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: '',
    component: WelcomeComponent,
  },
  {
    path: 'scores',
    component: ScoresComponent,
  },
  {
    path: 'friend',
    component: FriendComponent,
  },
  {
    path: 'leaderboard',
    component: LeaderboardComponent,
  },
  {
    path: 'earn',
    component: EarnComponent,
  },
  {
    path: 'connect/:id',
    component: WalletConnectComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
