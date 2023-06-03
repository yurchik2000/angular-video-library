import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Firestore, setDoc, collection, collectionData, docData, addDoc, doc } from '@angular/fire/firestore';
import { Subscription } from 'rxjs';
import { IMovie } from 'src/app/interfaces/movies.interface';
import { MoviesService } from 'src/app/services/movies.service';

@Component({
  selector: 'app-friend-info',
  templateUrl: './friend-info.component.html',
  styleUrls: ['./friend-info.component.scss']
})
export class FriendInfoComponent {

  public getDataSubscription?: Subscription;  
  public friendsMoviesIdList: Array<string> = [];
  public friendsMoviesList: Array<IMovie> = [];

  constructor(
    private activedRoute: ActivatedRoute,    
    private afs: Firestore,
    private movieService: MoviesService,
  ) {}

  ngOnInit() {
    this.loadFriend();
  }
  ngOnDestroy() {
    this.getDataSubscription?.unsubscribe();    
  }

  loadFriend(): void {        
    const friendEmail = this.activedRoute.snapshot.paramMap.get('email');        
    this.getSharedMovies(friendEmail as string);    
  }

  getSharedMovies(email:string): void {    
    this.getDataSubscription = docData(doc(this.afs, 'sharedMovies', email)).subscribe(data => {            
      if (data) {
        this.friendsMoviesIdList = data['moviesId'];
        for (let i=0; i<this.friendsMoviesIdList.length; i++) {
          this.getOneMovie(this.friendsMoviesIdList[i])
        }
      } else {

      }      
      // console.log(this.friendsMoviesIdList);
  });
  }
  
  getOneMovie(movieId: string): void {                
    this.movieService.getOneMovie(movieId).subscribe(
      (data) => {
        let movie: IMovie = this.movieService.convertDataToMvoeiInfo(data);
        movie.id = movieId;
        // console.log(2, movie)        
        this.friendsMoviesList.push(movie);                
      })      
  }

  addNewMovie(movieId: string): void {
    let currentUser = JSON.parse(localStorage.getItem('currentUser') as string);    
    const currentUserList = currentUser.myMovieId;    
    const index = currentUserList.indexOf(movieId);    
    if (index <0) {
      currentUser.myMovieId.push(movieId);
      setDoc(doc(this.afs, 'users', currentUser.uid), currentUser);                 
    } else {
      console.log('This movie is already in your list')
    }
    
  }

}
