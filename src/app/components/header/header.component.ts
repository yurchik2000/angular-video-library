import { Component } from '@angular/core';
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

  constructor(
    private movieService: MoviesService
  ) {}

  updateInput(): void {

  } 
  searchByTitle(): void {    
    this.movieService.inputMovieTitle = this.movieTitle;
    this.movieService.changeMovieTitle.next(true);    
  }
  searchOnImdb(title:string): void {
    if (title.length > 3) {
      this.movieService.getMoviesList(title).subscribe(data => {
        console.log(data);
      })
    }    
  }
  showAddMovieInput(): void {
    this.isShowAddMovie = !this.isShowAddMovie;    
  }


}
