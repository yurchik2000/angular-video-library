import { Component } from '@angular/core';
import { PersonService } from 'src/app/services/person.service';
import { IAwardContent, IVideoContent } from 'src/app/interfaces/movies.interface';
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
  public awardShowList: IVideoContent[] = [];
  public berlinData: IAwardContent[] = [    
    { id: '1101256', title: "Golden Bear", type: 'movie', movie: ''},
    { id: '1146410', title: "Silver Bear", type: 'movie', movie: ""},  
    { id: '929831', title: "Jury Prize", type: 'movie', movie: ""},
    { id: '1855531', title: "Best Director", type: 'person', movie: "'Pepe'"},
    { id: '60898', title: "Best Actor", type: 'person', movie: "'A Different Man'"},            
    { id: '1639', title: "Supporting Role", type: 'person', movie: "'Small Things Like These'"},
    { id: '1232781', title: "Best Screenplay", type: 'movie', movie: ""},
    { id: '931944', title: "Best Operator", type: 'movie', movie: ""},
    { id: '1232493', title: "Best Documentary", type: 'movie', movie: ""},
    { id: '643776', title: "Best First Feature", type: 'movie', movie: ""},
    { id: '1233393', title: "Best Short Film", type: 'movie', movie: ""},            
    
  ];
  public goldenData: IAwardContent[] = [
    { id: '54693', title: "Actor in Comedy", type: 'person', movie: "'Poor Things'"},  
    { id: '1133349', title: "Supporting Role", type: 'person', movie: "'The Crown'"},
    { id: '13242', title: "Actor in Comedy", type: 'person', movie: "'The Holdovers'"},
    { id: '1180099', title: "Supporting Role", type: 'person', movie: "'The Holdovers'"},
    { id: '525', title: "Director", type: 'person', movie: "'Oppenheimer'"},
    { id: '1183917', title: "Actor in Drama", type: 'person', movie: "'Killers of the Flower Moon'"},                  
    { id: '872585', title: "Best Drama", type: 'movie', movie: ''},
    { id: '508883', title: "Best Animated", type: 'movie', movie: ''},
    { id: '792307', title: "Best Comedy", type: 'movie', movie: ''},
    { id: '915935', title: "Best Non-English", type: 'movie', movie: ''},
    { id: '346698', title: "Best Box Office ", type: 'movie', movie: ''},
    { id: '154385', title: "Best TV", type: 'tv', movie: ''},
    { id: '76331', title: "Best TV - Drama", type: 'tv', movie: ''},
    { id: '136315', title: "Best TV - Comedy", type: 'tv', movie: ''},
    { id: '915935', title: "Best Screenplay", type: 'movie', movie: ''}      
  ];
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

    this.getAwardsList(this.berlinData);
            
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

  getAwardsList(awardList:IAwardContent[]): void {    
    
    if (localStorage.getItem('awardsList') && JSON.parse(localStorage.getItem('awardsList') || '').length === awardList.length ) {
      this.awardShowList = JSON.parse(localStorage.getItem('awardsList') || '');      
    } else {
      console.log('gerAwards')
      for( let i = 0; i < awardList.length;  i++) {
        if (awardList[i].type === 'movie') {
          this.personService.getMovieInfo(awardList[i].id).subscribe(
            (data:any) => {
              this.awardShowList.push({
                adult: data.adult,
                backdrop_path: data.backdrop_path,
                genre_ids: data.genre_ids,
                id: data.id,
                original_language: data.original_language,
                original_title: data.original_title,
                overview: data.overview,
                popularity: data.popularity,
                poster_path: data.poster_path,
                release_date: data.release_date,
                title: data.title,
                video: data.video,
                vote_average: data.vote_average,
                vote_count: data.count,
                name: data.name,
                first_air_date: data.first_air_date,
                media_type: 'movie',
                profile_path: data.profile_path,
                categoryTitle: awardList[i].title 
              });            
              localStorage.setItem('awardsList', JSON.stringify(this.awardShowList));
            }            
          )
        };
        if (awardList[i].type === 'tv') {
          this.personService.getSeriesInfo(awardList[i].id).subscribe(
            (data:any) => {
              this.awardShowList.push({
                adult: data.adult,
                backdrop_path: data.backdrop_path,
                genre_ids: data.genre_ids,
                id: data.id,
                original_language: data.original_language,
                original_title: data.original_title,
                overview: data.overview,
                popularity: data.popularity,
                poster_path: data.poster_path,
                release_date: data.release_date,
                title: data.title,
                video: data.video,
                vote_average: data.vote_average,
                vote_count: data.count,
                name: data.name,
                first_air_date: data.first_air_date,
                media_type: 'tv',
                profile_path: data.profile_path,
                categoryTitle: awardList[i].title 
              });            
              localStorage.setItem('awardsList', JSON.stringify(this.awardShowList));
            }
          )
        };
        if (awardList[i].type === 'person') {
          this.personService.getPersonInfo(awardList[i].id).subscribe(
            (data:any) => {
              this.awardShowList.push({
                adult: data.adult,
                backdrop_path: data.backdrop_path,
                genre_ids: data.genre_ids,
                id: data.id,
                original_language: data.original_language,
                original_title: data.original_title,
                overview: data.overview,
                popularity: data.popularity,
                poster_path: data.poster_path,
                release_date: data.release_date,
                title: data.name,
                video: data.video,
                vote_average: data.vote_average,
                vote_count: data.count,
                name: awardList[i].movie,
                first_air_date: data.first_air_date,
                media_type: 'person',
                profile_path: data.profile_path,
                categoryTitle: awardList[i].title 
              });            
              console.log(this.awardShowList);
              localStorage.setItem('awardsList', JSON.stringify(this.awardShowList));
            }          
          )        
        };      
      }      
    }
    
    // console.log(this.goldenGlobeList);
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
// this.goldenGlobeList.push({
//   id: goldenData[i].id,
//   categoryTitle: goldenData[i].title,
//   movieTitle: data.title,
//   personTitle: '',
//   poster_path: 'https://www.themoviedb.org/t/p/original/' + data.poster_path,
//   type: goldenData[i].type,
// })            