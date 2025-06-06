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
  public oscar2025: IAwardContent[] = [
  { id: '1064213', title: 'Best Picture', type: 'movie', movie: 'Anora' },
  { id: '118415', title: 'Best Director', type: 'person', movie: 'Anora' }, // Sean Baker
  { id: '1640439', title: 'Best Actress', type: 'person', movie: 'Anora' }, // Mikey Madison
  { id: '3490', title: 'Best Actor', type: 'person', movie: 'The Brutalist' }, // Adrien Brody
  { id: '8691', title: 'Supporting Actress', type: 'person', movie: 'Emilia Pérez' }, // Zoe Saldaña
  { id: '18793', title: 'Supporting Actor', type: 'person', movie: 'A Real Pain' }, // Kieran Culkin
  { id: '1064213', title: 'Original Screenplay', type: 'movie', movie: 'Anora' },
  { id: '974576', title: 'Adapted Screenplay', type: 'movie', movie: 'Conclave' },
  { id: '1000837', title: 'International Feature', type: 'movie', movie: "I'm Still Here" },
  { id: '823219', title: 'Animated Feature', type: 'movie', movie: 'Flow' },
  { id: '974950', title: 'Original Song', type: 'movie', movie: 'Emilia Pérez' }, // "El Mal"
  { id: '549509', title: 'Best Cinematography', type: 'movie', movie: 'The Brutalist' },
  { id: '402431', title: 'Costume Design', type: 'movie', movie: 'Wicked' },
  { id: '693134', title: 'Visual Effects', type: 'movie', movie: 'Dune: Part Two' }
];

  public goldenGlobe2025: IAwardContent[] = [    
    { id: '549509', title: "Best Drama", type: 'movie', movie: ''},
    { id: '974950', title: "Best Musical", type: 'movie', movie: ''},    
    { id: '823219', title: "Best Animated", type: 'movie', movie: ''},
    { id: '402431', title: "Box Office", type: 'movie', movie: ''},
    { id: '974950', title: "Best Non-English", type: 'movie', movie: ''},
    { id: '87335', title: "Best in Drama", type: 'person', movie: "'I'm Still Here'"},
    { id: '3490', title: "Best in Drama", type: 'person', movie: "'The Brutalist'"},
    { id: '3416', title: "Best in Comedy", type: 'person', movie: "'The Substance'"},
    { id: '60898', title: "Best in Comedy", type: 'person', movie: "'A Different Man'"},
    { id: '8691', title: "Best Supporting", type: 'person', movie: "'Emilia Pérez'"},
    { id: '18793', title: "Best Supporting", type: 'person', movie: "'A Real Pain'"},
    { id: '55493', title: "Best Director", type: 'person', movie: "'The Brutalist'"},
    { id: '974576', title: "Best Screenplay", type: 'movie', movie: ''},
    { id: '937287', title: "Best Original Score", type: 'movie', movie: ''},
    { id: '974950', title: "Best Original Song", type: 'movie', movie: ''},
    { id: '126308', title: "Best TV Drama", type: 'tv', movie: ''},
    { id: '124101', title: "Best TV  Comedy", type: 'tv', movie: ''},
    { id: '241259', title: "Best TV Series", type: 'tv', movie: ''},
    { id: '1434487', title: "Best in TV, Drama", type: 'person', movie: "'Shogun'"},
    { id: '9195', title: "Best in TV, Drama", type: 'person', movie: "'Shogun'"},
    { id: '5376', title: "Best in TV, Comedy", type: 'person', movie: "'Hacks'"},
    { id: '206905', title: "Best in TV, Comedy", type: 'person', movie: "'The Bear'"},
    { id: '1038', title: "Best Actor in TV", type: 'person', movie: "'Night Country'"},
    { id: '72466', title: "Best Actor in TV", type: 'person', movie: "'The Penguin'"},
    { id: '1196101', title: "Best Supporting", type: 'person', movie: "'Baby Reindeer'"},
    { id: '13275', title: "Best Supporting", type: 'person', movie: "'Shogun'"}
    

  ];
  public cannesData: IAwardContent[] = [    
    { id: '1064213', title: "Palme d'or", type: 'movie', movie: ''},
    { id: '927547', title: "Grand Prix", type: 'movie', movie: ''},
    { id: '150512', title: "Best director", type: 'person', movie: "'Grand Tour'"},    
    { id: '974950', title: "Juri Prize", type: 'movie', movie: ''},
    { id: '1278263', title: "Special Prize", type: 'movie', movie: ''},
    { id: '88124', title: "Best actor", type: 'person', movie: "'Kind of kindness'"},
    { id: '974950', title: "Best actress", type: 'movie', movie: ''},
    { id: '933260', title: "Best screenplay", type: 'movie', movie: ''},
    { id: '1109255', title: "Award for Technical", type: 'movie', movie: ''},
    { id: '592831', title: "Francis Ford Coppola", type: 'movie', movie: ''},
    { id: '970947', title: "David Cronenberg", type: 'movie', movie: ''},
    { id: '1136987', title: "Leos Carax", type: 'movie', movie: ''},
    { id: '1029955', title: "Yorgos Lanthimos", type: 'movie', movie: ''},
    { id: '1128752', title: "Andrea Arnold", type: 'movie', movie: ''},
    { id: '1082938', title: "Rungano Nyoni", type: 'movie', movie: ''},
    { id: '1108336', title: "Agathe Riedinger", type: 'movie', movie: ''},
    { id: '1214118', title: "Jonás Trueba", type: 'movie', movie: ''},
    { id: '1098709', title: "Miguel Gomes", type: 'movie', movie: ''},
    { id: '1232827', title: "Magnus von Horn", type: 'movie', movie: ''},
    { id: '1136837', title: "Jia Zhangke", type: 'movie', movie: ''},
    { id: '1182047', title: "Ali Abbasi", type: 'movie', movie: ''},
    { id: '1063574', title: "Alain Guiraudie", type: 'movie', movie: ''},
    { id: '1267822', title: "Hiroshi Okuyama", type: 'movie', movie: ''}
  ];
  public oscarData: IAwardContent[] = [    
    { id: '872585', title: "Best picture", type: 'movie', movie: ''},
    { id: '2037', title: "Best actor", type: 'person', movie: "'Oppenheimer'"},
    { id: '54693', title: "Best actress", type: 'person', movie: "'Poor Things'"},
    { id: '3223', title: "Supporting role", type: 'person', movie: "'Oppenheimer'"},
    { id: '1180099', title: "Supporting role", type: 'person', movie: "'The Holdovers'"},
    { id: '525', title: "Best director", type: 'person', movie: "'Oppenheimer'"},    
    { id: '467244', title: "Best international", type: 'movie', movie: ""},  
    { id: '1056360', title: "Adapted screenplay", type: 'movie', movie: ""},
    { id: '915935', title: "Original screenplay", type: 'movie', movie: ""},
    { id: '923939', title: "Live action short", type: 'movie', movie: ""},
    { id: '508883', title: "Best animated", type: 'movie', movie: ""},
    { id: '1058616', title: "Best documentary", type: 'movie', movie: ""},
    { id: '346698', title: "Best original song", type: 'movie', movie: ""},
    { id: '940721', title: "Best visual effects", type: 'movie', movie: ""},
    { id: '467244', title: "Best Sound", type: 'movie', movie: ""},
    { id: '1171861', title: "Documentary Short", type: 'movie', movie: ""},
    { id: '1214020', title: "Animated Short", type: 'movie', movie: ""},        
  ];
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

    // this.getAwardsList(this.oscarData);
    // this.getAwardsList(this.goldenGlobe2025);
    this.getAwardsList(this.oscar2025);
            
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
        // console.log('12',this.trending);
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