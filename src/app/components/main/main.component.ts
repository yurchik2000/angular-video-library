import { Component } from '@angular/core';
import { Subject } from 'rxjs';
import { IMovie } from 'src/app/interfaces/movies.interface';
import { MoviesService } from 'src/app/services/movies.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})

export class MainComponent {

  public moviesList: Array<IMovie> = [];
  public moviesIdList = [
    'tt6060964', 
    'tt0441909',
    'tt9770150',      
    'tt0109830', 
    'tt5827916',
    'tt13833688'
  ];
  public movieTitle = "";  
  public isGridMode = this.movieService.isGridMode;  
  public sortDirection1 = this.movieService.sortDirection;

  constructor(
    private movieService: MoviesService
  ) {}

  ngOnInit() {
    if (localStorage.getItem('movies')) {
      this.moviesList = JSON.parse(localStorage.getItem('movies') || '')
    }
    this.getAllMovies();    
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
  }

  updateSearch(): void {
    this.movieService.changeMovieTitle.subscribe( () => {      
      this.movieTitle = this.movieService.inputMovieTitle;
    })
  };

  updateMode(): void {    
    this.movieService.changeGridMode.subscribe( () => {           
      this.isGridMode = this.movieService.isGridMode;
    })
  };

  updateSortDirection(): void {
    this.movieService.changeSortDirection.subscribe( () => {           
      this.sortDirection1 = this.movieService.sortDirection;      
      console.log(2, this.sortDirection1);
    })
  };

  deleteMovie(id:string): void {
    console.log(this.moviesList);
    let index = this.moviesList.findIndex(movie => movie.id === id);
    this.moviesList.splice(index, 1);
    this.saveToLocalStorage(this.moviesList);
  }


}
