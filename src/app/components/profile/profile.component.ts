import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MoviesService } from 'src/app/services/movies.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {

  constructor(
    private router: Router,
    private movieService: MoviesService
  ) {}

  logOut(): void {    
    localStorage.removeItem('currentUser');          
    this.movieService.activeUser = {
      name: '',
      email: '',
      poster: ''
    };
    this.changeActiveUser();
    this.router.navigate(['']);    
  }

  changeActiveUser(): void {            
    this.movieService.changeActiveUser.next(true); 
  };

}
