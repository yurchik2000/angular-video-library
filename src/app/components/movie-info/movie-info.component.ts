import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RatingChangeEvent } from 'angular-star-rating';
import { ToastrService } from 'ngx-toastr';
import { IMovie } from 'src/app/interfaces/movies.interface';
import { MoviesService } from 'src/app/services/movies.service';
import { MatDialog } from '@angular/material/dialog'
import { TranslateDialogComponent } from '../translate-dialog/translate-dialog.component';

@Component({
  selector: 'app-movie-info',
  templateUrl: './movie-info.component.html',
  styleUrls: ['./movie-info.component.scss']
})
export class MovieInfoComponent {

  public movie: IMovie = this.movieService.initNewMovie();
  public moviesList: Array<IMovie> = [];
  public onRatingChangeResult?: RatingChangeEvent;   
  private userPlot: string = ""

  constructor(
    private toastr: ToastrService,        
    private activedRoute: ActivatedRoute,    
    private movieService: MoviesService,
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
      console.log(this.movie)
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

}
