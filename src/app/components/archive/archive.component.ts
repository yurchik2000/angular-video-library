import { Component } from '@angular/core';
import { Firestore, doc, docData, updateDoc } from '@angular/fire/firestore';
import { Subscription } from 'rxjs';
import { IArchiveMovie, IMovie, IMyMovie } from 'src/app/interfaces/movies.interface';
import { MoviesService } from 'src/app/services/movies.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-archive',
  templateUrl: './archive.component.html',
  styleUrls: ['./archive.component.scss']
})
export class ArchiveComponent {

  public archiveMoviesList: Array<IArchiveMovie> = [];
  public getDataSubscription?: Subscription;  
  private moviesList: Array<IMovie> = [];  

  constructor(
    private movieService: MoviesService,    
    private afs: Firestore,
    private toastr: ToastrService,            
    private router: Router,
  ) {}

  ngOnInit() {        
    console.log(236, this.movieService.archiveMoviesList);
    this.archiveMoviesList = this.movieService.archiveMoviesList;
    if (!this.archiveMoviesList.length) {
      if (localStorage.getItem('currentUser')) {
        const userObj = localStorage.getItem('currentUser') as string;      
        const user1 = JSON.parse(userObj);                                
        // this.getDataSubscription = docData(doc(this.afs, 'users', user1.uid)).subscribe(user => {            
        //     this.movieService.archiveMoviesList = user['archiveList'];
        //     console.log('archive', this.movieService.archiveMoviesList);    
        //     this.archiveMoviesList = this.movieService.archiveMoviesList;                    
        // });
        this.archiveMoviesList = user1.archiveList;
        }  
      };      
    }
    
    ngOnDestroy() {
      // this.getDataSubscription?.unsubscribe();
    }

    deleteMovie(id:string): void {
      const user = JSON.parse(localStorage.getItem('currentUser') || '');            
      let indexArchive = this.archiveMoviesList.findIndex(movie => movie.id === id);
      console.log(id, indexArchive, this.archiveMoviesList)

      this.archiveMoviesList.splice(indexArchive, 1);      
      this.movieService.archiveMoviesList = this.archiveMoviesList;
      user.archiveList = this.archiveMoviesList;
      localStorage.setItem('currentUser', JSON.stringify(user));
      updateDoc(doc(this.afs, 'users', user.uid), {archiveList: this.movieService.archiveMoviesList});            
      this.toastr.warning('This film successfully deleted from your list');        
    };

    restoreMovie(id:string): void {
      // this.deleteMovie(id);
      // this.getOneMovie(id);      
    }

    getOneMovie(movieId: string): void {        
      if (localStorage.getItem('movies')) {
        this.moviesList = JSON.parse(localStorage.getItem('movies') || '')
      };    
      let index = this.moviesList.findIndex(movie => movie.id === movieId);    
      if (index >=0 ) { 
        this.toastr.info('This film is already in your list');
      }
      else {              
        if (localStorage.getItem('currentUser')) {
          const currentUser = JSON.parse(localStorage.getItem('currentUser') as string);      
          const newMovie: IMyMovie = {
            id: movieId,                  
            favourite: false,
            myRating: 0,
            tags: [],
            watched: false,
            dateAdding: new Date(),          
            archive: false,
            comment: ''
          }
          console.log(7, newMovie);
          currentUser.myMovieId.push(newMovie);
          console.log(8, currentUser);
          localStorage.setItem('currentUser', JSON.stringify(currentUser));        
        }        
        this.movieService.getOneMovie(movieId).subscribe(data => {          
            let movie: IMovie = this.movieService.convertDataToMvoeiInfo(data);
            movie.id = movieId;          
            // console.log(1111, movie);
            this.moviesList.push(movie);        
            localStorage.setItem('movies', JSON.stringify(this.moviesList))            
            this.toastr.success('New film successfully added');
            this.router.navigate(['']);
          })
        
      }     
  
    }
    

}
