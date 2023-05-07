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
      // let movie: IMovie = this.movieService.initNewMovie();       
      this.movieService.getOneMovie(movieId).subscribe(data => {
          // console.log(data);
          // movie.id = movieId;
          // movie.title = data.Title;
          // movie.year = data.Year;
          // movie.imdbRating = Number(data.imdbRating);
          // if (movie.rtRating[1]) movie.rtRating = data.Ratings[1].Value;
          // movie.plot = data.Plot;          
          // movie.poster = data.Poster;          
          // if (data.Director === 'N/A') movie.director = []
          //  else {
          //   movie.director = data.Director.split(', ');
          //   movie.director.forEach(item => item.trim());          
          //  };
          // if (data.Writer === 'N/A') movie.writer = []
          //  else {
          //   movie.writer = data.Writer.split(', ');
          //   movie.writer.forEach(item => item.trim());          
          //  }           
          // movie.genres = data.Genre.split(', ');
          // movie.actors = data.Actors.split(', ');        
          // movie.awards = data.Awards;
          // if (data.Country === 'N/A') movie.country = []
          //  else {
          //   movie.country = data.Country.split(', ');
          //   movie.country.forEach(item => item.trim());          
          //  }                     
          // movie.type = data.Type;
          // if (data.Runtime === 'N/A') movie.runTime = ''
          //  else {
          //   movie.runTime = data.Runtime;            
          //  }                     
          // if (data.totalSeasons) movie.totalSeasons = data.totalSeasons;                      
          // movie.rated = data.Rated;
          let movie: IMovie = this.movieService.convertDataToMvoeiInfo(data);
          movie.id = movieId;
          console.log(1, movie)
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
