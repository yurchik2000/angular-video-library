import { Component } from '@angular/core';
import { IMovie } from 'src/app/interfaces/movies.interface';
import { MoviesService } from 'src/app/services/movies.service';
import { ToastrService } from 'ngx-toastr';
import { RatingChangeEvent } from 'angular-star-rating';


@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})

export class MainComponent {

  public moviesList: Array<IMovie> = [];
  // public moviesIdList = [
  //   'tt6060964', 
  //   'tt0441909',
  //   'tt9770150',      
  //   'tt0109830', 
  //   'tt5827916',
  //   'tt13833688'
  // ];
  public moviesIdList: Array <string> = [];    
  public movieTitle = "";  
  public isGridMode = this.movieService.isGridMode;  
  public sortDirection = this.movieService.sortDirection;  
  public activeGenre = '';
  public activeDirector = '';
  public activeActor = '';
  public currentPage = 1; 
  public onRatingChangeResult?: RatingChangeEvent;   
  

  constructor(
    private movieService: MoviesService,
    private toastr: ToastrService,        
  ) {}

  ngOnInit() {
    if (localStorage.getItem('movies')) {
      this.moviesList = JSON.parse(localStorage.getItem('movies') || '')
    } else this.getAllMovies();
    if (localStorage.getItem('currentUser')) {
      const listObj = localStorage.getItem('currentUser') as string;
      const list = JSON.parse(listObj);
      this.moviesIdList = list;
      console.log(list.myMovieId);      
      this.getAllMovies();
    };
    this.updateSearch();
    this.updateMode();
    this.updateSortDirection();
  }

  getAllMovies(): void {
    for( let i=0; i < this.moviesIdList.length; i++ ) {           
      if (!this.moviesList.find(element => element.id === this.moviesIdList[i])) {      
        this.getOneMovie(this.moviesIdList[i]); 
    }
  }
}

  getOneMovie(movieId: string): void {        
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
      this.movieService.getOneMovie(movieId).subscribe(data => {
        console.log(data);
        movie.id = movieId;
        movie.title = data.Title;      
        movie.year = data.Year;
        movie.imdbRating = Number(data.imdbRating);
        movie.plot = data.Plot;
        movie.poster = data.Poster;
        movie.director = data.Director.split(',');
        movie.director.forEach(item => item.trim());
        movie.genres = data.Genre.split(', ');
        movie.actors = data.Actors.split(',');
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

  updateSearch(): void {
    this.movieService.changeMovieTitle.subscribe( () => {      
      this.movieTitle = this.movieService.inputMovieTitle;
      this.currentPage = 1;
    })
  };

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

}
