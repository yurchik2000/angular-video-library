import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RatingChangeEvent } from 'angular-star-rating';
import { ToastrService } from 'ngx-toastr';
import { IActor, ICast, IMovie, IMyMovie, IShortMovie } from 'src/app/interfaces/movies.interface';
import { MoviesService } from 'src/app/services/movies.service';
import { MatDialog } from '@angular/material/dialog'
import { TranslateDialogComponent } from '../translate-dialog/translate-dialog.component';
import { PersonService } from 'src/app/services/person.service';
import { ActorDialogComponent } from '../actor-dialog/actor-dialog.component';

@Component({
  selector: 'app-movie-info',
  templateUrl: './movie-info.component.html',
  styleUrls: ['./movie-info.component.scss']
})
export class MovieInfoComponent {

  public movie: IMovie = this.movieService.initNewMovie();
  public moviesList: Array<IMovie> = [];
  public onRatingChangeResult?: RatingChangeEvent;   
  public movieBack:string = '';
  public movieTmdbId:string = '';
  public movieTmdbType: string = '';
  public movieUkTitle: string = '';
  public actor: IActor = {
    name: '',
    poster: '',
    known_for: []
  };
  public cast: Array<ICast> = [];
  public likeThisMovies: Array<IShortMovie> = [];
  public recommendations: Array<IShortMovie> = [];
  public isShowCast:boolean = false;
  public isShowMoreLikeThis:boolean = false;
  public isShowRecommendations:boolean = false;
  private userPlot: string = ""

  constructor(
    private toastr: ToastrService,        
    private activedRoute: ActivatedRoute,    
    private movieService: MoviesService,
    private personService: PersonService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    if (localStorage.getItem('movies')) {
      this.moviesList = JSON.parse(localStorage.getItem('movies') || '')
    }
    this.loadMovie();    
  }

  checkWatched(movie: IMovie): void {
    movie.watched = !movie.watched;
    this.saveToLocalStorage(this.moviesList);    
    if (movie.watched) this.toastr.info('Add to watched list'); else {
      this.toastr.info('Remove from watched list');
    }
  }
  saveToLocalStorage(moviesList: IMovie[]) {
    localStorage.setItem('movies', JSON.stringify(moviesList))
  }
  onRatingChange = ($event: RatingChangeEvent, id:string) => {
    // console.log(id, 'onRatingUpdated $event: ', $event);
    this.onRatingChangeResult = $event;
    let index = this.moviesList.findIndex(movie => movie.id === id);    
    this.moviesList[index].myRating = Number(this.onRatingChangeResult.rating);
    this.saveToLocalStorage(this.moviesList);
  };

  deleteMovie(id:string): void {
    // console.log(id, this.moviesList);
    let index = this.moviesList.findIndex(movie => movie.id === id);
    this.moviesList.splice(index, 1);
    this.saveToLocalStorage(this.moviesList);
    this.toastr.warning('This film successfully deleted from your list');        
  };
  
  loadMovie(): void {
    console.log('movie info');
    const id = this.activedRoute.snapshot.paramMap.get('id');   
    const index =  this.moviesList.findIndex( movie => { return id === movie.id})
    if (index >= 0) 
    {
      // console.log(id, index)
      this.movie = this.moviesList[index];    
      console.log(this.movie);      
      this.searchMovieTmdb(this.movie.id);
    } else {      
      this.router.navigate(['/']);
    }
  }

  showTranslate(text:string): void {            
    let text1 = text;
    if (text.length > 500) text1 = text.slice(0, 499);
    this.movieService.translate(text1).subscribe( (data:any) => {
      // console.log(data.responseData.translatedText);      
      this.userPlot = data.responseData.translatedText;      
      this.userPlot = this.userPlot.slice(0, -1)
      if (text.length > 500) {
        this.userPlot+= this.userPlot + '...'
      }
      this.openTranslateWindow()
    })
  }

  openTranslateWindow(): void {        
    // console.log(this.userPlot);
    this.dialog.open(TranslateDialogComponent, {
      backdropClass: 'dialog-back',
      panelClass: 'profile-dialog',
      autoFocus: false,
      data: { plot_ukr: this.userPlot },
      // height: '500px'      
    })
  }

  openActorWindow(): void {        
    // console.log(this.userPlot);
    this.dialog.open(ActorDialogComponent, {
      backdropClass: 'dialog-back',
      panelClass: 'profile-dialog',
      autoFocus: false,
      width: 'auto',
      data: { poster: `https://image.tmdb.org/t/p/w500/${this.actor.poster}`,
              name: this.actor.name
     },
      // height: '500px'      
    })
  }

  showActorInfo(actor:string): void {
    this.personService.getPeson(actor).subscribe(
      (data) => {
        console.log(data);
        if (data.results) {
          this.actor.name = data.results[0].name;
          this.actor.poster = data.results[0].profile_path;
          data.results[0].known_for.forEach( (item:any) => {            
            this.actor.known_for.push( {
              title: item.original_title, 
              poster: item.backdrop_path,
              id: item.id,
              type: item.media_type         
            }              
            )  
          })
          console.log(this.actor);
          this.openActorWindow();
        }

      }
    )  
    console.log(actor)
  }

  searchMovieTmdb(id:string): void {
    this.personService.searchMovieTmdb(id).subscribe(
     (data) => {
      console.log(data);
      if (data.movie_results.length) {
        console.log(data.movie_results);
        this.movieBack = 'https://image.tmdb.org/t/p/w500/' + data.movie_results[0].backdrop_path;
        this.movieTmdbId = data.movie_results[0].id;
        this.movieTmdbType = data.movie_results[0].media_type;
        this.movieUkTitle =  data.movie_results[0].title;
        console.log(this.movieTmdbId, this.movieTmdbType, this.movieUkTitle, this.movieBack)
      }
      if (data.tv_results.length) {
        console.log(data.tv_results);
        this.movieBack = 'https://image.tmdb.org/t/p/w500/' + data.tv_results[0].backdrop_path;
        this.movieTmdbId = data.tv_results[0].id;
        this.movieTmdbType = data.tv_results[0].media_type;
        this.movieUkTitle =  data.tv_results[0].name;
        console.log(this.movieTmdbId, this.movieTmdbType, this.movieUkTitle, this.movieBack)
      }
     }
    )
  }

  getMovieCast(id:string): void {
    this.personService.getMovieCast(id).subscribe(
      (data) => {
        if (data.cast) {
          console.log(data.cast);
          let person = {
            name: '',
            character: '',
            poster: ''
          }
          this.cast = [];
          data.cast.forEach( (item:any, index:number) => {
            if  ( (item.popularity > 6 && index <12) || index < 4) {
              person = {
                name: item.name,
                character: item.character,
                poster: `https://image.tmdb.org/t/p/w500/${item.profile_path}`
              }
              // if (!item.profile_path) {
              //   person.poster = `https://www.themoviedb.org/assets/2/v4/glyphicons/basic/glyphicons-basic-4-user-grey-d8fe957375e70239d6abdd549fd7568c89281b2179b5f4470e2e12895792dfa5.svg`;
              // }                            
              if (!item.profile_path) {
                person.poster = `assets/images/unknown-man.svg`;
              }                                    
              if (!item.profile_path && item.gender === 1) {                
                person.poster = `assets/images/unknown-woman.svg`;
              }                            
              this.cast.push(person);
          }
          })
          console.log(this.cast);
        }
      }
    )
  }

  getTvCast(id:string): void {
    this.personService.getTvCast(id).subscribe(
      (data) => {
        if (data.cast) {
          this.cast = [];
          let person = {
            name: '',
            character: '',
            poster: ''
          }
          console.log(data.cast);
          data.cast.forEach( (item:any, index:number) => {            
            if  ( (item.popularity > 8 && index <15) || index < 9) {
              person = {
                name: item.name,
                character: item.roles[0].character,
                poster: `https://image.tmdb.org/t/p/w500/${item.profile_path}`
              }
              // if (!item.profile_path) {
              //   person.poster = `https://www.themoviedb.org/assets/2/v4/glyphicons/basic/glyphicons-basic-4-user-grey-d8fe957375e70239d6abdd549fd7568c89281b2179b5f4470e2e12895792dfa5.svg`;
              // }                            
              if (!item.profile_path) {
                person.poster = `assets/images/unknown-man.svg`;
              }                                    
              if (!item.profile_path && item.gender === 1) {                
                person.poster = `assets/images/unknown-woman.svg`;
              }                            
              this.cast.push(person);
            }            
          })
          console.log(this.cast);
        }
      }
    )
  }

  showTopCast(): void {
    this.isShowCast = !this.isShowCast;
    this.isShowMoreLikeThis = false;
    this.isShowRecommendations = false;
    if (this.movieTmdbType === "movie") {
      this.getMovieCast(this.movieTmdbId);
    } else {
      this.getTvCast(this.movieTmdbId);
    }
  }

  getTvMoreLikeThis(id: string, count:number): void {
    this.personService.getTvMoreLikeThis(id).subscribe(
      (data) => {        
        console.log(data.results);      
        this.likeThisMovies = [];
        if (data.results) {                   
          if (!data.results.length) {
            this.toastr.info('There are no no any movies now');
          } else {
            this.likeThisMovies = [...this.sortByPopylarity(data.results, count)]
          }          
          console.log(this.likeThisMovies);
        }
      }
    )
  }

  getMovieMoreLikeThis(id: string, count:number): void {
    this.personService.getMovieMoreLikeThis(id).subscribe(
      (data) => {        
        console.log(data);
        this.likeThisMovies = [];
        if (data.results) { 
          if (!data.results.length) {
            this.toastr.info('There are no no any movies now');
          } else {
            // console.log(this.sortByPopylarity(data.results, 5));
            this.likeThisMovies = [...this.sortByPopylarity(data.results, count)]
          }          
          console.log(this.likeThisMovies);
        }
      }
    )
  }

  showMoreLikeThis(): void {
    this.isShowRecommendations = false;
    this.isShowCast = false;
    this.isShowMoreLikeThis = !this.isShowMoreLikeThis;
    this.likeThisMovies = [];
    if (this.movieTmdbType === "movie") {
      this.getMovieMoreLikeThis(this.movieTmdbId, 5)
    } else {
      this.getTvMoreLikeThis(this.movieTmdbId, 5)
    }
  }

  showRecommendations(): void {
    this.isShowCast = false;
    this.isShowMoreLikeThis = false;
    this.isShowRecommendations = !this.isShowRecommendations;
    this.recommendations = [];
    if (this.movieTmdbType === "movie") {
      this.getMovieRecommendations(this.movieTmdbId, 5)
    } else {
      this.getTvRecommendations(this.movieTmdbId, 5)
    }
  }
  
  getTvRecommendations(id: string, count:number): void {
    this.personService.getTvRecommendations(id).subscribe(
      (data) => {        
        console.log(data.results);      
        this.recommendations = [];
        if (data.results) {                   
          if (!data.results.length) {
            this.toastr.info('There are no no any movies now');
          } else {
            this.recommendations = [...this.sortByPopylarity(data.results, count)]
          }          
          console.log(this.recommendations);
        }
      }
    )    
  }

  getMovieRecommendations(id: string, count: number): void {
    this.personService.getMovieRecommendations(id).subscribe(
      (data) => {        
        console.log(data.results);      
        this.recommendations = [];
        if (data.results) {                   
          if (!data.results.length) {
            this.toastr.info('There are no no any movies now');
          } else {
            this.recommendations = [...this.sortByPopylarity(data.results, count)]
          }          
          console.log(this.recommendations);
        }
      }
    )    
  }

  sortByPopylarity(array:any, count:number): Array<IShortMovie> {
    let temp = array.sort(function(a:any, b:any) {
      return b.vote_average*b.vote_count- a.vote_average*a.vote_count
    })
    console.log(temp);                    
    let temp2:Array<IShortMovie> = [];
    temp.forEach( (item:any, index:number) => {            
      if  (index < count) {
        temp2.push({
          title: item.title || item.name,                
          poster: `https://image.tmdb.org/t/p/w500/${item.poster_path}`,
          id: item.id,
          type: item.media_type || this.movieTmdbType
        })
      }            
    })    
    return temp2;
  }

  addOneMovie(id:string, type:string): void {
    this.personService.getImdbId(id, type).subscribe(
      (data) => {
        console.log(data);
        const movieId = data.imdb_id;
        if (localStorage.getItem('movies')) {
          this.moviesList = JSON.parse(localStorage.getItem('movies') || '')
        };    
        let index = this.moviesList.findIndex(movie => movie.id === movieId);    
        if (index >=0 ) { 
          this.toastr.info('This film is already in your list');
        }
        else {      
          console.log(6);
          if (localStorage.getItem('currentUser')) {
            const currentUser = JSON.parse(localStorage.getItem('currentUser') as string);      
            const newMovie: IMyMovie = {
              id: movieId,
              favourite: false,
              myRating: 0,
              tags: [],
              watched: false,
              dateAdding: new Date(),          
              archive: false,
              comment: ''
            }
            console.log(7, newMovie);
            currentUser.myMovieId.push(newMovie); 
            console.log(8, currentUser);
            localStorage.setItem('currentUser', JSON.stringify(currentUser));        
          }      
    
          this.movieService.getOneMovie(movieId).subscribe(data => {          
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
    )
  }

}

