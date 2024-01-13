import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IVideoContent } from 'src/app/interfaces/movies.interface';
import { PersonService } from 'src/app/services/person.service';
import Swiper from 'swiper';

@Component({
  selector: 'app-movie-carousel',
  templateUrl: './movie-carousel.component.html',
  styleUrls: ['./movie-carousel.component.scss']
})
export class MovieCarouselComponent implements AfterViewInit {

  @Input() videoContents: IVideoContent[] = [];
  @Input() title!: string;
  @ViewChild('swiperContainer') swiperContainer!: ElementRef;


  constructor(
    private personService: PersonService,
    private router: Router,
  ) {}
  
  ngAfterViewInit(): void {
    this.initSwiper();
  }

  ngOninit() {

  }

  private initSwiper() {
    console.log('init');        
    return new Swiper(this.swiperContainer.nativeElement, {      
      slidesPerView: 1,
      slidesPerGroup: 1,
      centeredSlides: false,
      loop: true,                  
      breakpoints: {
        500: {
          slidesPerView: 2,
          slidesPerGroup: 1,
          spaceBetween: 5,
          centeredSlides: false,
        },
        700: {
          slidesPerView: 3,
          slidesPerGroup: 1,
          spaceBetween: 5,
          centeredSlides: false,
        },
        900: {
          slidesPerView: 4,
          slidesPerGroup: 4,
          spaceBetween: 5,
          centeredSlides: false,
        },
        1200: {
          slidesPerView: 5,
          slidesPerGroup: 5,
          spaceBetween: 5,
          centeredSlides: false,
        },        
      }
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

  goMovieDetails(tmdbId: number): void {
    this.personService.getImdbId(tmdbId.toString(), 'movie').subscribe(
      (data: any) => {
        console.log(data.imdb_id);
        // this.router.navigate([`/:${data.imdb_id}`]);        
      }
    )    
  }

}
