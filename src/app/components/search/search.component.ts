import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IMovie, ISearchListMovie } from 'src/app/interfaces/movies.interface';
import { MoviesService } from 'src/app/services/movies.service';
import { ToastrService } from 'ngx-toastr';

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
    private router: Router,
    private toastr: ToastrService
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
    if (localStorage.getItem('movies')) {
      this.moviesList = JSON.parse(localStorage.getItem('movies') || '')
    };    
    let index = this.moviesList.findIndex(movie => movie.id === movieId);    
    if (index >=0 ) { this.toastr.info('This film is already in your list');}
     else {
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
          this.toastr.success('New film successfully added');
          this.router.navigate(['']);
        })      
     }    
  }

  saveToLocalStorage(moviesList: IMovie[]) {
    localStorage.setItem('movies', JSON.stringify(moviesList))
  }




}
