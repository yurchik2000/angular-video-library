import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IArchiveMovie, IMovie, IMovieResponce, ISearchListMovie, ISearchResponce, IUser } from '../interfaces/movies.interface';

@Injectable({
  providedIn: 'root'
})
export class MoviesService {

  private url = environment.BACKEND_URL;
  private apiKey = environment.API_KEY;
  public inputMovieTitle = "";
  public searchMoviesList: Array<ISearchListMovie> = [];
  public archiveMoviesList: Array <IArchiveMovie> = [];

  public changeMovieTitle = new Subject<boolean>();
  public changeSearchMovieTitle = new Subject<boolean>();
  public changeSortDirection = new Subject<boolean>();
  public changeGridMode = new Subject<boolean>();
  public changeActiveUser = new Subject<boolean>();
  public changeShowFavourite = new Subject<boolean>;
  
  public isGridMode = false;  
  public sortDirection = true;
  public showFavourite = false;
  public activeUser?: IUser;
  public currentPageGlobal: number = 1;

  public isFirstStart: boolean = true;

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
    // console.log(33, data);
    let movie: IMovie = this.initNewMovie();           
          movie.id = data.imdbId;
          movie.title = data.Title;
          movie.year = data.Year;
          movie.imdbRating = Number(data.imdbRating);
          if (movie.rtRating[1]) movie.rtRating = data.Ratings[1].Value;
          if (data.Plot) movie.plot = data.Plot;
          if (data.Poster === 'N/A') movie.poster = "assets/images/unknown.png" 
            else movie.poster = data.Poster;                    
          if (data.Director === 'N/A') movie.director = []
           else {
            if (data.Director) movie.director = data.Director.split(', ');
            movie.director.forEach(item => item.trim());          
           };
          if (data.Writer === 'N/A') movie.writer = []
           else {
            if (data.Writer) movie.writer = data.Writer.split(', ');
            movie.writer.forEach(item => item.trim());          
           }           
          if (data.Genre) movie.genres = data.Genre.split(', ');
          if (data.Actors) movie.actors = data.Actors.split(', ');        
          if (data.Awards != 'N/A') movie.awards = data.Awards;          
          if (data.Country === 'N/A') movie.country = []
           else {
            if (data.Country) movie.country = data.Country.split(', ');
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

  translate(text: string): Observable<any> {    
    return this.http.get(`https://api.mymemory.translated.net/get?q=${text}!&langpair=en|uk`)    
  }
}


// function catchEror(arg0: (error: any) => void): import("rxjs").OperatorFunction<IMovieResponce, IMovieResponce> {
//   throw new Error('Function not implemented.');
// }

