import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IMovieResponce, ISearchResponce, ISearchListMovie } from 'src/app/interfaces/movies.interface';
import { MoviesService } from 'src/app/services/movies.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})

export class HeaderComponent {

  public movieTitle: string = "";
  public movieImdbTitle: string = "";
  public isShowAddMovie = false;  
  public isDescending = true;  
  public isGridMode = this.movieService.isGridMode;

  constructor(
    private movieService: MoviesService,
    private router: Router
  ) {}

  ngOnInit() {
    
  }

  updateInput(): void {

  } 
  searchByTitle(): void {    
    this.movieService.inputMovieTitle = this.movieTitle;
    this.movieService.changeMovieTitle.next(true);        
  }
  searchOnImdb(title:string): void {
    if (title.length > 3) {
      this.movieService.getMoviesList(title).subscribe(data => {                        
        if (data.totalResults > 0) {          
          this.movieService.searchMoviesList = data.Search;
          console.log(this.movieService.searchMoviesList);          
          this.router.navigate(['/search']);
          this.movieImdbTitle = '';
          this.movieService.changeSearchMovieTitle.next(true);
        }        
      })
    }    
  };
  showAddMovieInput(): void {
    this.isShowAddMovie = !this.isShowAddMovie;    
  };
  changeGridMode(): void {
    this.isGridMode = !this.isGridMode;
    this.movieService.isGridMode = this.isGridMode;
    this.movieService.changeGridMode.next(true);    
  };
  changeDirection(): void {
    this.isDescending = !this.isDescending;    
    this.movieService.sortDirection = this.isDescending;    
    this.movieService.changeSortDirection.next(true);    
  };


}
