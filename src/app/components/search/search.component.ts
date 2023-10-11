import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IMovie, IMyMovie, ISearchListMovie } from 'src/app/interfaces/movies.interface';
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
          console.log(1, movie);
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
