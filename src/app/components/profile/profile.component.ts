import { Component } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Firestore, setDoc } from '@angular/fire/firestore';
import { doc } from '@firebase/firestore';
import { Router } from '@angular/router';
import { IMovie } from 'src/app/interfaces/movies.interface';
import { MoviesService } from 'src/app/services/movies.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {

  constructor(
    private router: Router,
    private movieService: MoviesService,
    private auth: Auth,
    private afs: Firestore,
  ) {}

  logOut(): void {    
    const user = JSON.parse(localStorage.getItem('currentUser') || '');        
    const list = JSON.parse(localStorage.getItem('movies') || '');
    const moviesListId = list.map( (item:IMovie) => (item.id));    
    console.log(user.email);    
    user.myMovieId = moviesListId;        
    console.log(user.myMovieId);
    localStorage.removeItem('currentUser');    
    this.movieService.activeUser = {
      name: '',
      email: '',
      poster: ''
    };
    this.changeActiveUser();
    this.router.navigate(['']);    
    setDoc(doc(this.afs, 'users', user.uid), user);         

  }

  changeActiveUser(): void {                
    this.movieService.changeActiveUser.next(true); 
  };

}
