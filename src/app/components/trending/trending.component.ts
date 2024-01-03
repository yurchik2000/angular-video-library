import { Component } from '@angular/core';
import { PersonService } from 'src/app/services/person.service';
import { MovieCarouselComponent } from '../movie-carousel/movie-carousel.component';
import { IVideoContent } from 'src/app/interfaces/movies.interface';
import { MoviesService } from 'src/app/services/movies.service';

@Component({
  selector: 'app-trending',
  templateUrl: './trending.component.html',
  styleUrls: ['./trending.component.scss']
})

export class TrendingComponent {

  public popularMovies: IVideoContent[] = [];
  public upcomingMovies: IVideoContent[] = [];
  public nowPlayingMovies: IVideoContent[] = [];
  public trending: IVideoContent[] = [];
  public firstImage:string = '';
  public counter: number = 0;
  // public firstImage:string = 'https://www.themoviedb.org/t/p/original/ctMserH8g2SeOAnCw5gFjdQF8mo.jpg';

  constructor(
    private personService: PersonService,
  ) {}

  ngOnInit() {            
    this.counter = Math.floor(Math.random() * 10);
    this.getPopularMovies();    
    this.getTrending();        
    this.getUpcomingMovies();
    this.getNowPlayingMovies();        
    
  }    


 
  getPopularMovies(): void {    
    this.personService.getPopularMovie().subscribe(
      (data:any) => {        
        console.log(data.results);
        console.log(this.counter);
        this.popularMovies = data.results;
        this.firstImage = 'https://www.themoviedb.org/t/p/original/' + this.popularMovies[this.counter].backdrop_path;        
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
  getTrending(): void {
    this.personService.getTrending().subscribe(
      (data:any) => {        
        console.log(data.results);
        this.trending = data.results;        
      }
    )
  }

  onSwipeLeft() {
    console.log('swipe left')
  }

  
  

}
