import { Component } from '@angular/core';
import { PersonService } from 'src/app/services/person.service';
import { IVideoContent } from 'src/app/interfaces/movies.interface';
import { forkJoin, map } from 'rxjs';

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
  public sources = [
    this.personService.getPopularMovie(),        
    this.personService.getUpcomingMovie(),
    this.personService.getNowPlayingMovie(),
    this.personService.getTrending(),   
  ];
  
  // public firstImage:string = 'https://www.themoviedb.org/t/p/original/ctMserH8g2SeOAnCw5gFjdQF8mo.jpg';

  constructor(
    private personService: PersonService,
  ) {}

  ngOnInit() {            
    this.counter = Math.floor(Math.random() * 10);
    if (localStorage.getItem('trending')) {      
      let data = JSON.parse(localStorage.getItem('trending') || '');
      if (data.currentDate === new Date().getDay()) {
        this.popularMovies = data.popularMovies;
        this.firstImage = 'https://www.themoviedb.org/t/p/w1280/' + this.popularMovies[this.counter].backdrop_path;        
        this.upcomingMovies = data.upcomingMovies;
        this.nowPlayingMovies = data.nowPlayingMovies;        
        this.trending = data.trending;        
      } else {
        this.getAllTrendingData();
      }      
    } else {
      this.getAllTrendingData();
    }        
            
  }    

  getAllTrendingData():void {
    forkJoin(this.sources)
      .pipe(
       map(( [popularMovies, upcomingMovies, nowPlayingMovies, trending] ) => {
        return {popularMovies, upcomingMovies, nowPlayingMovies, trending}
       }        
       )
      ).subscribe((res:any)=> {
        this.popularMovies = res.popularMovies.results as IVideoContent[];
        this.firstImage = 'https://www.themoviedb.org/t/p/w1280/' + this.popularMovies[this.counter].backdrop_path;        
        this.popularMovies.map( movie => movie.media_type = 'movie');
        this.upcomingMovies = res.upcomingMovies.results as IVideoContent[];
        this.upcomingMovies.map( movie => movie.media_type = 'movie');
        this.nowPlayingMovies = res.nowPlayingMovies.results as IVideoContent[];
        this.nowPlayingMovies.map( movie => movie.media_type = 'movie');
        this.trending = res.trending.results as IVideoContent[];         
        localStorage.setItem('trending', JSON.stringify({
          currentDate: new Date().getDate(),
          popularMovies: this.popularMovies,
          upcomingMovies: this.upcomingMovies,
          nowPlayingMovies: this.nowPlayingMovies,
          trending: this.trending
        }))
     })  
  }

 
  // getPopularMovies(): void {    
  //   this.personService.getPopularMovie().subscribe(
  //     (data:any) => {        
  //       console.log(data.results);        
  //       this.popularMovies = data.results;
  //       this.allTrends.popularMovies = data.results;
  //       this.firstImage = 'https://www.themoviedb.org/t/p/original/' + this.popularMovies[this.counter].backdrop_path;        
  //     }
  //   )
  // }

  
}
