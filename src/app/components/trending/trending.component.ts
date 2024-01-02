import { Component } from '@angular/core';
import { PersonService } from 'src/app/services/person.service';
import { MovieCarouselComponent } from '../movie-carousel/movie-carousel.component';
import { IVideoContent } from 'src/app/interfaces/movies.interface';

@Component({
  selector: 'app-trending',
  templateUrl: './trending.component.html',
  styleUrls: ['./trending.component.scss']
})

export class TrendingComponent {

  public popularMovies: IVideoContent[] = [];
  public upcomingMovies: IVideoContent[] = [];
  public nowPlayingMovies: IVideoContent[] = [];
  public firstImage:string = '';
  // public firstImage:string = 'https://www.themoviedb.org/t/p/original/ctMserH8g2SeOAnCw5gFjdQF8mo.jpg';

  constructor(
    private personService: PersonService
  ) {}

  ngOnInit() {    
    this.getPopularMovies();    
    this.getUpcomingMovies();
    this.getNowPlayingMovies();
  }    


 
  getPopularMovies(): void {
    this.personService.getPopularMovie().subscribe(
      (data:any) => {        
        console.log(data.results);
        this.popularMovies = data.results;
        this.firstImage = 'https://www.themoviedb.org/t/p/original/' + this.popularMovies[0].poster_path;        
      }
    )
  }

  getUpcomingMovies(): void {
    this.personService.getUpcomingMovie().subscribe(
      (data:any) => {        
        console.log(data.results);
        this.upcomingMovies = data.results;        
      }
    )
  }

  getNowPlayingMovies(): void {
    this.personService.getNowPlayingMovie().subscribe(
      (data:any) => {        
        console.log(data.results);
        this.nowPlayingMovies = data.results;        
      }
    )
  }

  onSwipeLeft() {
    console.log('swipe left')
  }
  

}
