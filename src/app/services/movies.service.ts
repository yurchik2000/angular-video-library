import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IMovie, IMovieResponce, ISearchListMovie, ISearchResponce, IUser } from '../interfaces/movies.interface';

@Injectable({
  providedIn: 'root'
})
export class MoviesService {

  private url = environment.BACKEND_URL;
  private apiKey = environment.API_KEY;
  public inputMovieTitle = "";
  public searchMoviesList: Array<ISearchListMovie> = [];

  public changeMovieTitle = new Subject<boolean>();
  public changeSearchMovieTitle = new Subject<boolean>();
  public changeSortDirection = new Subject<boolean>();
  public changeGridMode = new Subject<boolean>();
  public changeActiveUser = new Subject<boolean>();
  
  public isGridMode = false;  
  public sortDirection = true;
  public activeUser?: IUser;
  public currentPageGlobal: number = 1;

  constructor(
    private http: HttpClient
  ) { }

  ngOnInit() {
  }

  getOneMovie(movieId: string): Observable<IMovieResponce> {
    return this.http.get<IMovieResponce>(`${this.url}?apikey=${this.apiKey}&i=${movieId}&plot=full`)    
  }
  getMoviesList(title: string): Observable<ISearchResponce> {
    return this.http.get<ISearchResponce>(`${this.url}?apikey=${this.apiKey}&s=${title}`)
  }
  initNewMovie(): IMovie {
    return {
      id: '',
      title: '',
      year: 0,
      imdbRating: 0,
      myRating: 0,
      rtRating: '',
      plot: '',
      director: [],
      poster: '',
      genres: [],
      actors: [],
      writer: [],
      rated: '',
      watched: false,
      favourite: false,
      dateAdding: new Date(),
      country: [],
      awards: '',
      type: '',
      tags: [],
      archive: false,
      runTime: '',
      totalSeasons: ''
    };  
  };

  convertDataToMvoeiInfo(data: IMovieResponce): IMovie {
    let movie: IMovie = this.initNewMovie();       
    console.log(data);
          movie.id = data.imdbId;
          movie.title = data.Title;
          movie.year = data.Year;
          movie.imdbRating = Number(data.imdbRating);
          if (movie.rtRating[1]) movie.rtRating = data.Ratings[1].Value;
          movie.plot = data.Plot;           
          movie.poster = data.Poster;          
          if (data.Director === 'N/A') movie.director = []
           else {
            movie.director = data.Director.split(', ');
            movie.director.forEach(item => item.trim());          
           };
          if (data.Writer === 'N/A') movie.writer = []
           else {
            movie.writer = data.Writer.split(', ');
            movie.writer.forEach(item => item.trim());          
           }           
          movie.genres = data.Genre.split(', ');
          movie.actors = data.Actors.split(', ');        
          if (data.Awards != 'N/A') movie.awards = data.Awards;          
          if (data.Country === 'N/A') movie.country = []
           else {
            movie.country = data.Country.split(', ');
            movie.country.forEach(item => item.trim());          
           }                     
          movie.type = data.Type;
          if (data.Runtime === 'N/A') movie.runTime = ''
           else {
            movie.runTime = data.Runtime;            
           }                     
          if (data.totalSeasons) movie.totalSeasons = data.totalSeasons;                      
          if (data.Rated === 'N/A') movie.rated = ''
           else {
            movie.rated = data.Rated;
           }                               
    return movie
  }

}
// function catchEror(arg0: (error: any) => void): import("rxjs").OperatorFunction<IMovieResponce, IMovieResponce> {
//   throw new Error('Function not implemented.');
// }

