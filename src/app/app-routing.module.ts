import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './components/main/main.component';
import { SearchComponent } from './components/search/search.component';
import { AuthComponent } from './components/auth/auth.component';
import { ProfileComponent } from './components/profile/profile.component';
import { MovieInfoComponent } from './components/movie-info/movie-info.component';
import { FriendInfoComponent } from './components/friend-info/friend-info.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';


const routes: Routes = [
  { path: "", component: MainComponent },
  { path: "search", component: SearchComponent},
  { path: "auth", component: AuthComponent},
  { path: "profile", component: ProfileComponent},
  { path: "profile/:email", component: FriendInfoComponent},
  { path: ":id", component: MovieInfoComponent},
  { path: '**', component: PageNotFoundComponent },     
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {scrollPositionRestoration: 'enabled'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
