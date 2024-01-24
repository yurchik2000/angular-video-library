import { Component } from '@angular/core';
import { IArchiveMovie, IMovie, IMyMovie } from 'src/app/interfaces/movies.interface';
import { MoviesService } from 'src/app/services/movies.service';
import { ToastrService } from 'ngx-toastr';
import { RatingChangeEvent } from 'angular-star-rating';
import { Firestore, setDoc, docData, updateDoc, getDoc, collection, getDocs } from '@angular/fire/firestore';
import { doc } from '@firebase/firestore';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';

import { FirstStartDialogComponent } from '../first-start-dialog/first-start-dialog.component'; 

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})

export class MainComponent {

  public moviesList: Array<IMovie> = [];
  public moviesDataList: Array<IMovie> = [];  
  // public archiveMoviesList: Array <IArchiveMovie> = [];
  // public myMovieId: Array <IMyMovie> = [];
  public moviesIdList: Array <string> = [];    
  public sharedIdList: Array <string> = [];  
  public movieTitle = "";  
  public isGridMode = this.movieService.isGridMode;  
  public isShowFavourite = this.movieService.showFavourite;
  public sortDirection = this.movieService.sortDirection;  
  public activeGenre = '';
  public activeDirector = '';
  public activeActor = '';
  public currentPage = this.movieService.currentPageGlobal; 
  public onRatingChangeResult?: RatingChangeEvent;     
  public getDataSubscription?: Subscription;  
  public isSpiner = this.movieService.isFirstStart;
  
  constructor(
    private movieService: MoviesService,
    private toastr: ToastrService,        
    private afs: Firestore,
    private dialog: MatDialog
  ) {}

  ngOnInit() {            
    console.log('hello', this.movieService.isFirstStart);

    if (localStorage.getItem('movies')) {
        this.moviesDataList = JSON.parse(localStorage.getItem('movies') || '');        
    }  
    if (localStorage.getItem('movies') && !localStorage.getItem('currentUser')) {
      this.moviesDataList = JSON.parse(localStorage.getItem('movies') || '');
      this.moviesList = this.moviesDataList;
      this.isSpiner = false;
      console.log('un', this.moviesDataList)
  }  
    // this.moviesList = [ ...this.moviesDataList ];        
    // console.log(2345, this.moviesList);
    // if (!localStorage.getItem('currentUser')) {            
    //     this.moviesList = [ ...this.moviesDataList ];        
    //   }  
    // if (localStorage.getItem('currentUser') && !this.movieService.isFirstStart) {            
    //   this.moviesList = [ ...this.moviesDataList ];
    //   console.log(123, this.moviesDataList);
    // }
                
    if (localStorage.getItem('currentUser') && this.movieService.isFirstStart) {
      console.log('first', this.movieService.isFirstStart);
      
      const userObj = localStorage.getItem('currentUser') as string;      
      const user1 = JSON.parse(userObj);
      
      this.getDataSubscription = docData(doc(this.afs, 'users', user1.uid)).subscribe(user => {
          console.log(324);          
          localStorage.setItem('currentUser', JSON.stringify(user));
          
          if (user['archiveList']) this.movieService.archiveMoviesList = user['archiveList'];          
          console.log('archive init', this.movieService.archiveMoviesList);          
          // localStorage.setItem('archiveList', JSON.stringify(this.movieService.archiveMoviesList));
          // user['friendsList'] = user1['friendsList'];

          if (this.movieService.isFirstStart) {
            console.log(user['myMovieId']);
          for( let i=0; i < user['myMovieId'].length; i++ ) {
                if (!this.moviesDataList.find(element => element.id === user['myMovieId'][i].id)) {
                  this.movieService.getOneMovie(user['myMovieId'][i].id).subscribe(
                    (data) => {
                      let movie: IMovie = this.movieService.convertDataToMvoeiInfo(data);
                      movie.id = user['myMovieId'][i].id;                  
                      movie.favourite = user['myMovieId'][i].favourite;
                      movie.myRating = user['myMovieId'][i].myRating;
                      movie.tags = user['myMovieId'][i].tags;
                      movie.watched = user['myMovieId'][i].watched;                            
                      this.moviesList.push(movie);
                      this.moviesDataList.push(movie);
                      this.saveToLocalStorage(this.moviesDataList);
                    })      
                } else {              
                  const index = this.moviesDataList.findIndex( (item:IMovie) => item.id === user['myMovieId'][i].id);              
                  this.moviesDataList[index].favourite = user['myMovieId'][i].favourite;
                  this.moviesDataList[index].myRating = user['myMovieId'][i].myRating;
                  this.moviesDataList[index].tags = user['myMovieId'][i].tags;
                  this.moviesDataList[index].watched = user['myMovieId'][i].watched;        
                  this.moviesList.push(this.moviesDataList[index]);
                  this.saveToLocalStorage(this.moviesDataList);
                }
              }  
              this.movieService.isFirstStart = false;               
              this.isSpiner = false;
          }
          
      });

      this.sharedIdList = this.moviesList
        .filter( (movie: IMovie) => movie.favourite)
        .map( (movie: IMovie ) => movie.id );
      if (localStorage.getItem('currentUser')) {
          const currentUser = JSON.parse(localStorage.getItem('currentUser') as string);
          setDoc(doc(this.afs, 'sharedMovies', currentUser.email), {moviesId: this.sharedIdList, userName: currentUser.name});
      }  
    };

    if (!localStorage.getItem('movies')) {
      this.isSpiner = false;
    }

    if (!this.moviesList.length && this.movieService.isFirstStart) {
      // this.openFirstStartWindow();           
    } else {
      if (localStorage.getItem('movies')) {
        this.moviesList = JSON.parse(localStorage.getItem('movies') || '');
      }     
    }

    this.updateSearch();
    this.updateMode();
    this.updateSortDirection();    
    this.updateShowFavourite();

    
    
  }  

  ngOnDestroy() {
    this.getDataSubscription?.unsubscribe();
  }

  // getAllMovies(userIdlist: Array<IMyMovie>): void {        
  //   for( let i=0; i < userIdlist.length; i++ ) {                 
  //     if (!this.moviesList.find(element => element.id === userIdlist[i].id)) {
  //       console.log(1, i, userIdlist[i].id)      
  //       this.movieService.getOneMovie(userIdlist[i].id).subscribe(
  //         (data) => {
  //           let movie: IMovie = this.movieService.convertDataToMvoeiInfo(data);
  //           movie.id = userIdlist[i].id;          
  //           movie.favourite = userIdlist[i].favourite;
  //           movie.myRating = userIdlist[i].myRating;
  //           movie.tags = userIdlist[i].tags;
  //           movie.watched = userIdlist[i].watched;    
  //           console.log(2, movie)        
  //           this.moviesList.push(movie);            
  //           this.saveToLocalStorage(this.moviesList);
  //         })      
  //     } else {
  //       console.log(2, i, userIdlist[i].id)
  //       const index = this.moviesList.findIndex( (item:IMovie) => item.id === userIdlist[i].id);
  //       this.moviesList[index].favourite = userIdlist[i].favourite;
  //       this.moviesList[index].myRating = userIdlist[i].myRating;
  //       this.moviesList[index].tags = userIdlist[i].tags;
  //       this.moviesList[index].watched = userIdlist[i].watched;        
  //     }
  //   }            
  // }

  getOneMovie(movieId: IMyMovie): void {                
    this.movieService.getOneMovie(movieId.id).subscribe(
      (data) => {
        let movie: IMovie = this.movieService.convertDataToMvoeiInfo(data);
        movie.id = movieId.id;
        
        movie.favourite = movieId.favourite;
        movie.myRating = movieId.myRating;
        movie.tags = movieId.tags;
        movie.watched = movieId.watched;

        console.log(2, movie)        
        this.moviesList.push(movie);        
        // this.saveToLocalStorage(this.moviesList);
      })      
  }

  saveToLocalStorage(moviesList: IMovie[]) {
    localStorage.setItem('movies', JSON.stringify(moviesList))
  }

  checkWatched(movie: IMovie) {
    movie.watched = !movie.watched;    
    this.saveToLocalStorage(this.moviesList);

    if (localStorage.getItem('currentUser')) {
      const currentUser = JSON.parse(localStorage.getItem('currentUser') as string);      
      const index = currentUser.myMovieId.findIndex( (item:IMyMovie) => item.id === movie.id);
      currentUser.myMovieId[index].watched = movie.watched;      
      localStorage.setItem('currentUser', JSON.stringify(currentUser));      
      updateDoc(doc(this.afs, 'users', currentUser.uid), {myMovieId: currentUser.myMovieId}); 
    }

    if (movie.watched) {
      this.toastr.info('Add to watched list');            
    }
    else {
      this.toastr.info('Remove from watched list');
    }    
  }

  checkFavourite(movie: IMovie): void {
    movie.favourite = !movie.favourite;
    this.saveToLocalStorage(this.moviesList);

    this.sharedIdList = this.moviesList
        .filter( (movie: IMovie) => movie.favourite)
        .map( (movie: IMovie ) => movie.id )
    console.log(this.sharedIdList);

    if (localStorage.getItem('currentUser')) {

      const currentUser = JSON.parse(localStorage.getItem('currentUser') as string);      
      const index = currentUser.myMovieId.findIndex( (item:IMyMovie) => item.id === movie.id);
      currentUser.myMovieId[index].favourite = movie.favourite;      
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
      updateDoc(doc(this.afs, 'users', currentUser.uid), {myMovieId: currentUser.myMovieId}); 

      setDoc(doc(this.afs, 'sharedMovies', currentUser.email), {moviesId: this.sharedIdList, userName: currentUser.name});      
    }
    
    // if (movie.favourite) this.toastr.info('Add to watched list'); else {
    //   this.toastr.info('Remove from watched list');
    // }
  }

  updateSearch(): void {    
    this.movieService.changeMovieTitle.subscribe( () => {            
      this.movieTitle = this.movieService.inputMovieTitle;
      this.currentPage = 1;
    })
  };

  clearInput(): void {    
    this.movieService.inputMovieTitle = '';
    this.movieService.currentPageGlobal = this.currentPage;
    this.movieService.changeMovieTitle.next(true);
  }

  updateMode(): void {    
    this.movieService.changeGridMode.subscribe( () => {           
      this.isGridMode = this.movieService.isGridMode;
    })
  };

  updateSortDirection(): void {
    this.movieService.changeSortDirection.subscribe( () => {           
      this.sortDirection = this.movieService.sortDirection;            
    })
  };

  updateShowFavourite(): void {
    this.movieService.changeShowFavourite.subscribe( () => {           
      this.isShowFavourite = this.movieService.showFavourite; 
      console.log(this.currentPage);      
      this.currentPage = 1;
    })
  };

  deleteMovie(id:string): void {
    

    if (localStorage.getItem('currentUser')) {
      const user = JSON.parse(localStorage.getItem('currentUser') || '');

      let index = this.moviesList.findIndex(movie => movie.id === id);           
      const userMovieList = user.myMovieId;
      let index2 = userMovieList.findIndex( (movie:IMyMovie)  => movie.id === id);    
      console.log(id, this.moviesList, userMovieList);    
    
      userMovieList.splice(index2, 1);
      user.myMovieId = userMovieList;    
    
      updateDoc(doc(this.afs, 'users', user.uid), {myMovieId: user.myMovieId}); 
    
      localStorage.setItem('currentUser', JSON.stringify(user));
    
      this.toastr.warning('This film successfully deleted from your list');        

      let indexArchive = this.movieService.archiveMoviesList.findIndex(movie => movie.id === id);     

      if (indexArchive < 0 ) {
        let aMovie:IArchiveMovie = {
          id: this.moviesList[index].id,        
          year: this.moviesList[index].year,          
          title: this.moviesList[index].title,          
          genres: this.moviesList[index].genres,
          poster: this.moviesList[index].poster,
          type: this.moviesList[index].type,
          myRating: this.moviesList[index].myRating,
          favourite: this.moviesList[index].favourite,
          watched: this.moviesList[index].watched,
          dateAdding: this.moviesList[index].dateAdding,
          tags: this.moviesList[index].tags,    
          comment: ''
        };      
        this.movieService.archiveMoviesList.push(aMovie);
        user.archiveList = this.movieService.archiveMoviesList;
        this.moviesList.splice(index, 1);
        this.saveToLocalStorage(this.moviesList);
        localStorage.setItem('currentUser', JSON.stringify(user));
        //  console.log('main archive', user)
        updateDoc(doc(this.afs, 'users', user.uid), {archiveList: this.movieService.archiveMoviesList});  
    } else {
      this.moviesList.splice(index, 1);
      this.saveToLocalStorage(this.moviesList);
      localStorage.setItem('currentUser', JSON.stringify(user));
    };
      
    } else  {

      let index = this.moviesList.findIndex(movie => movie.id === id);           
      this.moviesList.splice(index, 1);
      this.saveToLocalStorage(this.moviesList);

    }

    
  };

  changeActiveGenre(genre:string): void {
    if (this.activeGenre === genre) this.activeGenre = '';
     else this.activeGenre = genre;
    this.currentPage = 1; 
  };
  changeActiveDirector(director:string): void {
    if (this.activeDirector === director) this.activeDirector = '';
     else this.activeDirector = director;
    this.currentPage = 1; 
  };
  changeActiveActor(actor:string): void {
    if (this.activeActor === actor) this.activeActor = '';
     else this.activeActor = actor;
  this.currentPage = 1;   
  };
  setMyRating(): void {
    for( let i=0; i < this.moviesList.length; i++ ) {           
      if (!this.moviesList[i].myRating) this.moviesList[i].myRating = 0;
  }
  };

  onRatingChange = ($event: RatingChangeEvent, id:string) => {
    // console.log(id, 'onRatingUpdated $event: ', $event);
    this.onRatingChangeResult = $event;
    let index = this.moviesList.findIndex(movie => movie.id === id);    
    this.moviesList[index].myRating = Number(this.onRatingChangeResult.rating);
    this.saveToLocalStorage(this.moviesList);

    if (localStorage.getItem('currentUser')) {
      const currentUser = JSON.parse(localStorage.getItem('currentUser') as string);      
      const index = currentUser.myMovieId.findIndex( (item:IMyMovie) => item.id === id);
      currentUser.myMovieId[index].myRating = Number(this.onRatingChangeResult.rating);      
      localStorage.setItem('currentUser', JSON.stringify(currentUser));      
      updateDoc(doc(this.afs, 'users', currentUser.uid), {myMovieId: currentUser.myMovieId}); 
    }

  };

  zeroRating(id:string): void {
    let index = this.moviesList.findIndex(movie => movie.id === id);    
    this.moviesList[index].myRating = 0;
    this.saveToLocalStorage(this.moviesList);
    if (localStorage.getItem('currentUser')) {
      const currentUser = JSON.parse(localStorage.getItem('currentUser') as string);      
      const index = currentUser.myMovieId.findIndex( (item:IMyMovie) => item.id === id);
      currentUser.myMovieId[index].myRating = 0;      
      localStorage.setItem('currentUser', JSON.stringify(currentUser));      
      updateDoc(doc(this.afs, 'users', currentUser.uid), {myMovieId: currentUser.myMovieId}); 
    }
  }

  // saveDataToFireStore() {
  //   const user = JSON.parse(localStorage.getItem('currentUser') || '');        
  //   if (user) {
  //     const userIdList = this.moviesList.map ( (movie:IMovie) => movie.id);    
  //     user.myMovieId = userIdList;
  //     localStorage.setItem('currentUser', JSON.stringify(user));
  //     setDoc(doc(this.afs, 'users', user.uid), user);             
  //   }    
  // }

  openFirstStartWindow(): void {        
    // console.log(this.userPlot);
    this.dialog.open(FirstStartDialogComponent, {
      backdropClass: 'dialog-back',
      panelClass: 'profile-dialog',
      autoFocus: false,      
    })
  }


  
  

}
