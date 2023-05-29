import { Component } from '@angular/core';
import { IMovie } from 'src/app/interfaces/movies.interface';
import { MoviesService } from 'src/app/services/movies.service';
import { ToastrService } from 'ngx-toastr';
import { RatingChangeEvent } from 'angular-star-rating';
import { Firestore, setDoc, docData } from '@angular/fire/firestore';
import { doc } from '@firebase/firestore';


@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})

export class MainComponent {

  public moviesList: Array<IMovie> = [];
  public moviesIdList: Array <string> = [];    
  public sharedIdList: Array <string> = [];
  public movieTitle = "";  
  public isGridMode = this.movieService.isGridMode;  
  public sortDirection = this.movieService.sortDirection;  
  public activeGenre = '';
  public activeDirector = '';
  public activeActor = '';
  public currentPage = this.movieService.currentPageGlobal; 
  public onRatingChangeResult?: RatingChangeEvent;   
  
  constructor(
    private movieService: MoviesService,
    private toastr: ToastrService,        
    private afs: Firestore,    
  ) {}

  ngOnInit() {
    if (localStorage.getItem('movies')) {
      this.moviesList = JSON.parse(localStorage.getItem('movies') || '');      
    }     

    if (localStorage.getItem('currentUser')) {
      const userObj = localStorage.getItem('currentUser') as string;      
      const user = JSON.parse(userObj);      

      docData(doc(this.afs, 'users', user.uid)).subscribe(user => {        
          this.getAllMovies(user['myMovieId'])                        
        // localStorage.setItem('currentUser', JSON.stringify(user));
      });
      this.sharedIdList = this.moviesList
        .filter( (movie: IMovie) => movie.favourite)
        .map( (movie: IMovie ) => movie.id )
    };

    this.updateSearch();
    this.updateMode();
    this.updateSortDirection();
  }  

  getAllMovies(userIdlist: Array<string>): void {    
    for( let i=0; i < userIdlist.length; i++ ) {           
      if (!this.moviesList.find(element => element.id === userIdlist[i])) {      
        this.getOneMovie(userIdlist[i]);
    }
  }
  }

  getOneMovie(movieId: string): void {                
    this.movieService.getOneMovie(movieId).subscribe(
      (data) => {
        let movie: IMovie = this.movieService.convertDataToMvoeiInfo(data);
        movie.id = movieId;
        console.log(2, movie)        
        this.moviesList.push(movie);        
        this.saveToLocalStorage(this.moviesList);
      })      
  }

  saveToLocalStorage(moviesList: IMovie[]) {
    localStorage.setItem('movies', JSON.stringify(moviesList))
  }

  checkWatched(movie: IMovie): void {
    movie.watched = !movie.watched;
    this.saveToLocalStorage(this.moviesList);    
    if (movie.watched) this.toastr.info('Add to watched list'); else {
      this.toastr.info('Remove from watched list');
    }
  }

  checkFavourite(movie: IMovie): void {
    movie.favourite = !movie.favourite;
    this.saveToLocalStorage(this.moviesList);
    this.sharedIdList = this.moviesList
        .filter( (movie: IMovie) => movie.favourite)
        .map( (movie: IMovie ) => movie.id )
    console.log(this.sharedIdList);            
    // if (movie.favourite) this.toastr.info('Add to watched list'); else {
    //   this.toastr.info('Remove from watched list');
    // }
  }

  updateSearch(): void {    
    this.movieService.changeMovieTitle.subscribe( () => {            
      this.movieTitle = this.movieService.inputMovieTitle;
      this.currentPage = 1;
    })
  };

  clearInput(): void {    
    this.movieService.inputMovieTitle = '';
    this.movieService.currentPageGlobal = this.currentPage;
    this.movieService.changeMovieTitle.next(true);
  }

  updateMode(): void {    
    this.movieService.changeGridMode.subscribe( () => {           
      this.isGridMode = this.movieService.isGridMode;
    })
  };

  updateSortDirection(): void {
    this.movieService.changeSortDirection.subscribe( () => {           
      this.sortDirection = this.movieService.sortDirection;            
    })
  };

  deleteMovie(id:string): void {
    console.log(id, this.moviesList);
    let index = this.moviesList.findIndex(movie => movie.id === id);
    this.moviesList.splice(index, 1);
    this.saveToLocalStorage(this.moviesList);
    this.toastr.warning('This film successfully deleted from your list');        
  };

  changeActiveGenre(genre:string): void {
    if (this.activeGenre === genre) this.activeGenre = '';
     else this.activeGenre = genre;
    this.currentPage = 1; 
  };
  changeActiveDirector(director:string): void {
    if (this.activeDirector === director) this.activeDirector = '';
     else this.activeDirector = director;
    this.currentPage = 1; 
  };
  changeActiveActor(actor:string): void {
    if (this.activeActor === actor) this.activeActor = '';
     else this.activeActor = actor;
  this.currentPage = 1;   
  };
  setMyRating(): void {
    for( let i=0; i < this.moviesList.length; i++ ) {           
      if (!this.moviesList[i].myRating) this.moviesList[i].myRating = 0;
  }
  };

  onRatingChange = ($event: RatingChangeEvent, id:string) => {
    // console.log(id, 'onRatingUpdated $event: ', $event);
    this.onRatingChangeResult = $event;
    let index = this.moviesList.findIndex(movie => movie.id === id);    
    this.moviesList[index].myRating = Number(this.onRatingChangeResult.rating);
    this.saveToLocalStorage(this.moviesList);
  };

  zeroRating(id:string): void {
    let index = this.moviesList.findIndex(movie => movie.id === id);    
    this.moviesList[index].myRating = 0;
    this.saveToLocalStorage(this.moviesList);
  }

  saveDataToFireStore() {
    const user = JSON.parse(localStorage.getItem('currentUser') || '');        
    const userIdList = this.moviesList.map ( (movie:IMovie) => movie.id);    
    user.myMovieId = userIdList;
    localStorage.setItem('currentUser', JSON.stringify(user));
    setDoc(doc(this.afs, 'users', user.uid), user);             
  }

}
