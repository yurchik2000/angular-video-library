import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './components/main/main.component';
import { SearchComponent } from './components/search/search.component';
import { AuthComponent } from './components/auth/auth.component';
import { ProfileComponent } from './components/profile/profile.component';
import { MovieInfoComponent } from './components/movie-info/movie-info.component';


const routes: Routes = [
  { path: "", component: MainComponent },
  { path: "search", component: SearchComponent},
  { path: "auth", component: AuthComponent},
  { path: "profile", component: ProfileComponent},
  { path: ":id", component: MovieInfoComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
