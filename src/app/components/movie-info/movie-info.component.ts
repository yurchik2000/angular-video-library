import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RatingChangeEvent } from 'angular-star-rating';
import { ToastrService } from 'ngx-toastr';
import { IMovie } from 'src/app/interfaces/movies.interface';
import { MoviesService } from 'src/app/services/movies.service';

@Component({
  selector: 'app-movie-info',
  templateUrl: './movie-info.component.html',
  styleUrls: ['./movie-info.component.scss']
})
export class MovieInfoComponent {

  public movie: IMovie = this.movieService.initNewMovie();
  public moviesList: Array<IMovie> = [];
  public onRatingChangeResult?: RatingChangeEvent;   

  constructor(
    private toastr: ToastrService,        
    private activedRoute: ActivatedRoute,    
    private movieService: MoviesService,
    private router: Router,
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
      console.log(id, index)
      this.movie = this.moviesList[index];    
      console.log(this.movie)
    } else {
      console.log('NO SUCH PAGE');
      this.router.navigate(['/']);
    }
  }
}
