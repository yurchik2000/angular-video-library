import { Component } from '@angular/core';
import { Route, Router } from '@angular/router';
import { IMovie, ISearchListMovie } from 'src/app/interfaces/movies.interface';
import { MoviesService } from 'src/app/services/movies.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent {

  public searchMoviesList: Array<ISearchListMovie> = this.movieService.searchMoviesList;
  private moviesList: Array<IMovie> = [];

  constructor(
    private movieService: MoviesService,
    private router: Router
  ) {};

  ngOnInit() {
    this.updateSearch();
  };  

  updateSearch(): void {    
    this.movieService.changeSearchMovieTitle.subscribe( () => {           
      this.searchMoviesList = this.movieService.searchMoviesList;
    })
  };

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
        if (localStorage.getItem('movies')) {
          this.moviesList = JSON.parse(localStorage.getItem('movies') || '')
        };
        this.moviesList.push(movie);        
        this.saveToLocalStorage(this.moviesList);
        this.router.navigate(['']);
      })      
  }

  saveToLocalStorage(moviesList: IMovie[]) {
    localStorage.setItem('movies', JSON.stringify(moviesList))
  }




}
