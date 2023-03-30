import { Component } from '@angular/core';
import { MoviesService } from 'src/app/services/movies.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})

export class HeaderComponent {

  public movieTitle: string = "";

  constructor(
    private movieService: MoviesService
  ) {}

  updateInput(): void {

  } 
  searchByTitle(): void {    
    this.movieService.inputMovieTitle = this.movieTitle;
    this.movieService.changeMovieTitle.next(true);    
  }

}
