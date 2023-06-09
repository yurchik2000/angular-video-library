import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Firestore, setDoc, collection, collectionData, docData, addDoc, doc } from '@angular/fire/firestore';
import { Subscription } from 'rxjs';
import { IMovie } from 'src/app/interfaces/movies.interface';
import { MoviesService } from 'src/app/services/movies.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-friend-info',
  templateUrl: './friend-info.component.html',
  styleUrls: ['./friend-info.component.scss']
})
export class FriendInfoComponent {

  public getDataSubscription?: Subscription;  
  public friendsMoviesIdList: Array<string> = [];
  public friendsMoviesList: Array<IMovie> = [];
  public friendsName: string = '';
  public friendsEmail: string = '';
  private moviesList: Array<IMovie> = [];

  constructor(
    private activedRoute: ActivatedRoute,    
    private afs: Firestore,
    private movieService: MoviesService,
    private toastr: ToastrService,        
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
        this.friendsName = data['userName'];
        this.friendsEmail = email;
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
        this.friendsMoviesList.push(movie);                
      })      
  }

  addNewMovie(movieId: string): void {
    let currentUser = JSON.parse(localStorage.getItem('currentUser') as string);
    const currentUserList = currentUser.myMovieId;    
    const index = currentUserList.indexOf(movieId);    
    console.log(index);
    if (index < 0) {
      currentUser.myMovieId.push(movieId);
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
      setDoc(doc(this.afs, 'users', currentUser.uid), currentUser);     

      this.movieService.getOneMovie(movieId).subscribe(
      (data) => {
        let movie: IMovie = this.movieService.convertDataToMvoeiInfo(data);
        movie.id = movieId;
        console.log(2, movie);
        if (localStorage.getItem('movies')) {
          this.moviesList = JSON.parse(localStorage.getItem('movies') as string);
        }        
        this.moviesList.push(movie);        
        localStorage.setItem('movies', JSON.stringify(this.moviesList))
      })        
      this.toastr.success('New movie successfully added');            
    } else {
      console.log('This movie is already in your list')
      this.toastr.info('This movie is already in your list');
    }
    
  }

}
