import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserComponent } from './components/user/user.component';
import { LeaderboardComponent } from './components/leaderboard/leaderboard.component';
import { RegisterComponent } from './components/register/register.component';

const routes: Routes = [
  { path: 'register/:survey/:ref', component: RegisterComponent },
  { path: 'leaderboard', component: LeaderboardComponent },
  { path: 'users', component: UserComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
