import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { WelcomeComponent } from './welcome/welcome.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { TutorialComponent } from './tutorial/tutorial.component';
import { PlayComponent } from './play/play.component';
import { GameComponent } from './game/game.component';

const routes: Routes = [
	{ path: '', component: WelcomeComponent },
	{ path: 'login', component: LoginComponent },
	{ path: 'register', component: RegisterComponent }, 
	{ path: 'play', component: PlayComponent }, 
	{ path: 'game', component: GameComponent }, 
	{ path: 'tutorial', component: TutorialComponent },   
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
