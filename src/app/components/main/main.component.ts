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
    private afs: Firestore,    
  ) {}

  ngOnInit() {
    if (localStorage.getItem('movies')) {
      this.moviesList = JSON.parse(localStorage.getItem('movies') || '')
    } 

    if (localStorage.getItem('currentUser')) {
      const userObj = localStorage.getItem('currentUser') as string;      
      const user = JSON.parse(userObj);      

      docData(doc(this.afs, 'users', user.uid)).subscribe(user => {
        this.getAllMovies(user['myMovieId']);
        // localStorage.setItem('currentUser', JSON.stringify(user));
      });
            
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
    let movie: IMovie = {
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
      this.movieService.getOneMovie(movieId).subscribe(data => {
        console.log(2, data);
        movie.id = movieId;
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
           }          
        if (data.Writer === 'N/A') movie.writer = []
           else {
            movie.writer = data.Writer.split(', ');
            movie.writer.forEach(item => item.trim());          
           };
        movie.genres = data.Genre.split(', ');
        movie.actors = data.Actors.split(', ');        
        movie.awards = data.Awards;
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
        movie.rated = data.Rated,        
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

  clearInput(): void {    
    this.movieService.inputMovieTitle = '';
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

  saveDataToFireStore() {
    const user = JSON.parse(localStorage.getItem('currentUser') || '');        
    const userIdList = this.moviesList.map ( (movie:IMovie) => movie.id);    
    user.myMovieId = userIdList;
    localStorage.setItem('currentUser', JSON.stringify(user));
    setDoc(doc(this.afs, 'users', user.uid), user);             
  }

}
