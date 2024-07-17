import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WelcomeComponent } from './welcome/welcome.component';
import { HomeComponent } from './home/home.component';
import { ScoresComponent } from './scores/scores.component';
import { EarnComponent } from './earn/earn.component';
import { LeaderboardComponent } from './leaderboard/leaderboard.component';

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
        path: 'earn',
        component: EarnComponent,
    },
    {
        path: 'leaderboard',
        component: LeaderboardComponent,
    }, 
  ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
