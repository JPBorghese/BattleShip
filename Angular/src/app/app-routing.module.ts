import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { WelcomeComponent } from './welcome/welcome.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { TutorialComponent } from './tutorial/tutorial.component';
import { SearchComponent } from './search/search.component';
import { GameComponent } from './game/game.component';
import { LeaderboardComponent } from './leaderboard/leaderboard.component';

const routes: Routes = [
	{ path: '', component: WelcomeComponent },
	{ path: 'login', component: LoginComponent },
	{ path: 'register', component: RegisterComponent }, 
	{ path: 'search', component: SearchComponent }, 
	{ path: 'game', component: GameComponent }, 
	{ path: 'tutorial', component: TutorialComponent },   
	{ path: 'leaderboard', component: LeaderboardComponent },   
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
