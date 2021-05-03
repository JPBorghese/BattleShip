import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {FormsModule} from "@angular/forms";
import {MatButtonModule} from '@angular/material/button';
import {IgxButtonModule } from 'igniteui-angular';
import {HttpClientModule } from '@angular/common/http';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatIconModule} from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider';
import {MatSelectModule} from '@angular/material/select';
import {MatDialogModule} from '@angular/material/dialog';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { SearchComponent } from './search/search.component';
import { TutorialComponent } from './tutorial/tutorial.component';
import { RegisterComponent } from './register/register.component';
import { GameComponent } from './game/game.component';

import { WebsocketService } from './_services/websocket.service';
import { LeaderboardComponent } from './leaderboard/leaderboard.component';
import { StatsComponent } from './stats/stats.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    WelcomeComponent,
    SearchComponent,
    TutorialComponent,
    RegisterComponent,
    GameComponent,
    LeaderboardComponent,
    StatsComponent, 
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule, 
    IgxButtonModule, 
    MatButtonModule,
    HttpClientModule,
    MatGridListModule,
    MatSnackBarModule, 
    MatIconModule, 
    MatDividerModule, 
    MatSelectModule,
    MatDialogModule
  ],
  providers: [WebsocketService],
  bootstrap: [AppComponent]
})
export class AppModule { }
