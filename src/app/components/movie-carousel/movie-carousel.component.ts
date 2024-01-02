import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { IVideoContent } from 'src/app/interfaces/movies.interface';
import Swiper from 'swiper';
import { Navigation, Pagination } from 'swiper';

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

  ){}
  ngAfterViewInit(): void {
    this.initSwiper();
  }

  ngOninit() {

  }

  private initSwiper() {
    console.log('init');        
    return new Swiper(this.swiperContainer.nativeElement, {
      modules: [Navigation, Pagination],
      slidesPerView: 1,
      slidesPerGroup: 1,
      centeredSlides: false,
      loop: true,            
      grabCursor: true,      
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
          slidesPerGroup: 1,
          spaceBetween: 5,
          centeredSlides: false,
        },
        1200: {
          slidesPerView: 5,
          slidesPerGroup: 1,
          spaceBetween: 5,
          centeredSlides: false,
        },        
      }
    })
  }

}
