import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MoviesService } from 'src/app/services/movies.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})

export class HeaderComponent {

  public movieTitle: string = this.movieService.inputMovieTitle;
  public movieImdbTitle: string = "";
  public isShowAddMovie = false;  
  public isDescending = true;  
  public isGridMode = this.movieService.isGridMode;
  public isActiveUser = false;
  public activeUserName = '';

  constructor(
    private movieService: MoviesService,
    private router: Router,
    private toastr: ToastrService,    
  ) {}

  ngOnInit() {
    this.checkActiveUser();        
    this.updateActiveUser();
    this.updateSearch()
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
        } else {
          this.toastr.warning('There is no any film with such word in the title');
        }
      })
    } else {
      if (title.length <= 3) this.toastr.info('Type more then 3 symbols');
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
  checkActiveUser(): void {
    if (localStorage.getItem('currentUser')) { 
      this.isActiveUser = true;
      const userEmail = JSON.parse(localStorage.getItem('currentUser') || '').email;      
      this.activeUserName = userEmail[0].toUpperCase();
    }  
     else {
      this.isActiveUser = false;
     }
  };
  updateActiveUser(): void {    
    this.movieService.changeActiveUser.subscribe( () => {                             
      this.activeUserName = (this.movieService.activeUser?.email || '').charAt(0).toUpperCase();      
      if (this.activeUserName) this.isActiveUser = true
        else this.isActiveUser = false;
    })
  };

  updateSearch(): void {    
    this.movieService.changeMovieTitle.subscribe( () => {            
      this.movieTitle = this.movieService.inputMovieTitle;      
    })
  };


}
