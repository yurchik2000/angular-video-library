import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RatingChangeEvent } from 'angular-star-rating';
import { ToastrService } from 'ngx-toastr';
import { IActor, ICast, IMovie, IShortMovie } from 'src/app/interfaces/movies.interface';
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
  public actor: IActor = {
    name: '',
    poster: '',
    known_for: []
  };
  public cast: Array<ICast> = [];
  public likeThisMovies: Array<IShortMovie> = [];
  public isShowCast:boolean = false;
  public isShowMoreLikeThis:boolean = false;
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
    const id = this.activedRoute.snapshot.paramMap.get('id');   
    const index =  this.moviesList.findIndex( movie => { return id === movie.id})
    if (index >= 0) 
    {
      // console.log(id, index)
      this.movie = this.moviesList[index];    
      console.log(this.movie);
      this.searchMovieTmdb(this.movie.title);
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
              poster: item.backdrop_path
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

  searchMovieTmdb(title:string): void {
    this.personService.searchMovieTmdb(title).subscribe(
     (data) => {
      if (data.results) {
        console.log(data.results[0]);
        this.movieBack = 'https://image.tmdb.org/t/p/w500/' + data.results[0].backdrop_path;
        this.movieTmdbId = data.results[0].id;
        this.movieTmdbType = data.results[0].media_type;        
      }
     }
    )
  }

  getMovieCast(id:string): void {
    this.personService.getMovieCast(id).subscribe(
      (data) => {
        if (data.cast) {
          console.log(data.cast);
          data.cast.forEach( (item:any, index:number) => {
            if  (item.popularity > 6 || index < 4) {
            this.cast.push({
              name: item.name,
              character: item.character,
              poster: `https://image.tmdb.org/t/p/w500/${item.profile_path}`
            })
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
          console.log(data.cast);
          data.cast.forEach( (item:any, index:number) => {            
            if  (item.popularity > 6 || index < 4) {
              this.cast.push({
                name: item.name,
                character: item.character,
                poster: `https://image.tmdb.org/t/p/w500/${item.profile_path}`
              })
            }            
          })
          console.log(this.cast);
        }
      }
    )
  }

  showTopCast(): void {
    this.isShowCast = !this.isShowCast;
    if (this.movieTmdbType === "movie") {
      this.getMovieCast(this.movieTmdbId);
    } else {
      this.getTvCast(this.movieTmdbId);
    }
  }

  getTvMoreLikeThis(id: string): void {
    this.personService.getTvMoreLikeThis(id).subscribe(
      (data) => {        
        // console.log(data.results);
        if (data.results) {                    
          let temp = data.results.sort(function(a:any, b:any) {
            return b.popularity - a.popularity
          })
          // console.log(temp);
          temp.forEach( (item:any, index:number) => {            
            if  (index < 5) {
              this.likeThisMovies.push({
                title: item.name,                
                poster: `https://image.tmdb.org/t/p/w500/${item.poster_path}`
              })
            }            
          })
          console.log(this.likeThisMovies);
        }
      }
    )
  }

  getMovieMoreLikeThis(id: string): void {
    this.personService.getMovieMoreLikeThis(id).subscribe(
      (data) => {        
        // console.log(data.results);
        if (data.results) { 
          let temp = data.results.sort(function(a:any, b:any) {
            return b.popularity - a.popularity
          })
          // console.log(temp);                    
          data.results.forEach( (item:any, index:number) => {            
            if  (index < 5) {
              this.likeThisMovies.push({
                title: item.title,                
                poster: `https://image.tmdb.org/t/p/w500/${item.poster_path}`
              })
            }            
          })
          console.log(this.likeThisMovies);
        }
      }
    )
  }

  showMoreLikeThis(): void {
    this.isShowMoreLikeThis = !this.isShowMoreLikeThis;
    this.likeThisMovies = [];
    if (this.movieTmdbType === "movie") {
      this.getMovieMoreLikeThis(this.movieTmdbId)
    } else {
      this.getTvMoreLikeThis(this.movieTmdbId)
    }
  }

}
