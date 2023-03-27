import { Component } from '@angular/core';
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
    'tt10627352'
  ]  

  constructor(
    private movieService: MoviesService
  ) {}

  ngOnInit() {
    this.getAllMovies();    
  }

  getAllMovies(): void {
    for( let i=0; i < this.moviesIdList.length; i++ ) {           
      if (!this.moviesList.find(element => element.id === this.moviesIdList[i])) {      
        this.getOneMovie(this.moviesIdList[i])
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
      actors: []  
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
        this.moviesList.push(movie)        
      })
    }


}
