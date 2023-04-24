import { Component } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Firestore, setDoc, docData } from '@angular/fire/firestore';
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
    this.saveDataToFireStore();
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

  synchronization(): void {
    this.getDataFromFireStore();
    this.saveDataToFireStore();
  };
  saveDataToFireStore() {
    const user = JSON.parse(localStorage.getItem('currentUser') || '');        
    const list = JSON.parse(localStorage.getItem('movies') || '');
    const moviesListId = list.map( (item:IMovie) => (item.id));    
    console.log(user.email); 
    user.myMovieId = moviesListId;        
    console.log(user.myMovieId);
    setDoc(doc(this.afs, 'users', user.uid), user);         
  }

  getDataFromFireStore() {
    const user = JSON.parse(localStorage.getItem('currentUser') || '');        
    const list = JSON.parse(localStorage.getItem('movies') || '');
    const myData = docData(doc(this.afs, 'users', user.uid)).subscribe(user => {      
      const fireStoreList = user['myMovieId'];
      for( let i=0; i < fireStoreList.length; i++ ) {           
        if (!list.find( (element:IMovie) => element.id === fireStoreList[i])) {      
                let movie: IMovie = {
                  id: '',
                  title: '',
                  year: 0,
                  imdbRating: 0,
                  myRating: 0,
                  plot: '',
                  director: [],
                  poster: '',
                  genres: [],
                  actors: [],
                  watched: false 
                };       
                this.movieService.getOneMovie(fireStoreList[i]).subscribe(data => {
                  console.log(data);
                  movie.id = fireStoreList[i];
                  movie.title = data.Title;      
                  movie.year = data.Year;
                  movie.imdbRating = Number(data.imdbRating);
                  movie.plot = data.Plot;
                  movie.poster = data.Poster;
                  movie.director = data.Director.split(',');
                  movie.director.forEach(item => item.trim());
                  movie.genres = data.Genre.split(', ');
                  movie.actors = data.Actors.split(',');
                  console.log(movie);
                  list.push(movie);        
                  localStorage.setItem('movies', JSON.stringify(list))
                })                          
      }}
    });                

    // const list = JSON.parse(localStorage.getItem('movies') || '');
    // const moviesListId = list.map( (item:IMovie) => (item.id));        
    // user.myMovieId = moviesListId;        
    // console.log(user.myMovieId);
    // setDoc(doc(this.afs, 'users', user.uid), user);         
  }
  

}
