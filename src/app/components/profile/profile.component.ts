import { Component } from '@angular/core';
import { Firestore, setDoc, collection, collectionData, docData, addDoc, updateDoc } from '@angular/fire/firestore';
import { doc } from '@firebase/firestore';
import { Router } from '@angular/router';
import { IMovie, IUser } from 'src/app/interfaces/movies.interface';
import { MoviesService } from 'src/app/services/movies.service';
import { MatDialog } from '@angular/material/dialog'
import { ProfileDialogComponent } from '../profile-dialog/profile-dialog.component';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {

  public activeUser: IUser = {
    poster: '',
    name: '',
    email: '',
    moviesId: [],
    uid: '',
    friendsList: []
  }  
  public usersList: Array<string> = [];
  public moviesDataList: Array<IMovie> = [];  
  private moviesList: Array<IMovie> = [];
  public friendsList: Array<string> = [];
  public isShowUsers = false;
  public isShowAddFriend = false;
  public friendEmail: string = '';
  public getDataSubscription?: Subscription;  

  constructor(
    private router: Router,
    private movieService: MoviesService,    
    private afs: Firestore,
    private dialog: MatDialog,
    private toastr: ToastrService,

  ) {}

  ngOnInit() {
    // if (localStorage.getItem('movies')) this.saveDataToFireStore();
    if (localStorage.getItem('currentUser')) this.getActiveUser();

    if (localStorage.getItem('currentUser')) {
      console.log('second', this.movieService.isFirstStart);
      
      const userObj = localStorage.getItem('currentUser') as string;            
      const user1 = JSON.parse(userObj);
      console.log(5, user1);
      if (localStorage.getItem('movies')) {
        this.moviesDataList = JSON.parse(localStorage.getItem('movies') || ''); }
      
      this.getDataSubscription = docData(doc(this.afs, 'users', user1.uid)).subscribe(user => {          
          localStorage.setItem('currentUser', JSON.stringify(user));
          
          if (user['archiveList']) this.movieService.archiveMoviesList = user['archiveList'];          
          // console.log('archive init', this.movieService.archiveMoviesList);          
          // localStorage.setItem('archiveList', JSON.stringify(this.movieService.archiveMoviesList));
          user['friendsList'] = user1['friendsList'];
          this.moviesList = [];

          // if (this.movieService.isFirstStart) {
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
                      localStorage.setItem('movies', JSON.stringify(this.moviesList));                      
                    })      
                } else {              
                  const index = this.moviesDataList.findIndex( (item:IMovie) => item.id === user['myMovieId'][i].id);              
                  this.moviesDataList[index].favourite = user['myMovieId'][i].favourite;
                  this.moviesDataList[index].myRating = user['myMovieId'][i].myRating;
                  this.moviesDataList[index].tags = user['myMovieId'][i].tags;
                  this.moviesDataList[index].watched = user['myMovieId'][i].watched;        
                  this.moviesList.push(this.moviesDataList[index]);
                  localStorage.setItem('movies', JSON.stringify(this.moviesList));                  
                }
              // }  
              this.movieService.isFirstStart = false; 
          }
          
      });
      
    };

    // this.getSharedMovies();
  }

  ngOnDestroy() {
    this.getDataSubscription?.unsubscribe();    
  }

  logOut(): void {        
    if (localStorage.getItem('movies')) this.saveDataToFireStore();
    const user = JSON.parse(localStorage.getItem('currentUser') || '');
    setDoc(doc(this.afs, 'users', user.uid), user);             
    localStorage.removeItem('currentUser');   
    
    this.movieService.activeUser = {
      name: '',
      email: '',
      poster: '',
      moviesId: [],
      uid: '',
      friendsList: []
    };
    this.changeActiveUser();
    this.router.navigate(['']);        
  }

  changeActiveUser(): void {                
    this.movieService.changeActiveUser.next(true); 
  };

  saveDataToFireStore() {
    const user = JSON.parse(localStorage.getItem('currentUser') || '');        
    const list = JSON.parse(localStorage.getItem('movies') || '');

    // const moviesListId = list.map( (item:IMovie) => (item.id));
    const moviesListId = list.map( (item:IMovie) => ({
      id: item.id,
      favourite: item.favourite,
      myRating: item.myRating,
      tags: item.tags,      
      watched: item.watched,          
    }));    
    console.log(21, moviesListId);
    user.myMovieId = moviesListId;
    if (this.movieService.archiveMoviesList) user.archiveList = this.movieService.archiveMoviesList;
    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user));
    }
    // setDoc(doc(this.afs, 'users', user.uid), {myMovieId: user.myMovieId});             
    updateDoc(doc(this.afs, 'users', user.uid), {myMovieId: user.myMovieId});
    //     setDoc(doc(this.afs, 'users', user1.uid), {moviesId: this.sharedIdList, userName: currentUser.name});
  }

  getActiveUser(): void {
    if (localStorage.getItem('currentUser')) {      
      this.activeUser = JSON.parse(localStorage.getItem('currentUser') || '');
      this.friendsList = this.activeUser.friendsList;
      // console.log(this.activeUser)            
    }
  }
  editProfile(): void {
    
  }
  getUserFromFireStore(): void {
  //   docData(doc(this.afs, 'users', 'SAl3wYsSrgWiBY1wLKu1tTLb0932')).subscribe(user => {        
  //     console.log(user)
  // });
    const collectionInstance = collection(this.afs, 'users');
    collectionData(collectionInstance).subscribe(user => {      
      this.usersList = user.map(item => item['email']);
      console.log('gerUserFromFirestore ',this.usersList);            
    })
  };

  addDataToFireStore(data:any): void {
    const collectionInstance = collection(this.afs, 'users');
    addDoc(collectionInstance, data)
     .then( ()=> {
      // console.log('Data saved');
      this.toastr.info('Data saved')
     })
     .catch( (err: any) => {
      this.toastr.error(err)
     })
  }

  changeUsersShow(): void {
    this.isShowUsers = !this.isShowUsers
  }
  openUserEditDialog(): void {
    this.dialog.open(ProfileDialogComponent, {
      backdropClass: 'dialog-back',
      panelClass: 'profile-dialog',
      autoFocus: false,
      // height: '500px'      
    }).afterClosed().subscribe(result => {
      if (localStorage.getItem('currentUser')) this.getActiveUser();            
    })
  }

  addFriend(): void {
    this.isShowAddFriend = !this.isShowAddFriend;
  }

  searchFriend(): void {
    const number = this.friendsList.indexOf(this.friendEmail);    
    if (this.friendEmail === this.activeUser.email) {
      this.toastr.info('you can not be friend for yourself')
      return
    }
    console.log('friendsList', this.friendsList);
    if (number >=0 ) {            
      this.toastr.info('This user already in your list')
    } else {
      const collectionInstance = collection(this.afs, 'users');
      collectionData(collectionInstance).subscribe(user => {      
        if (this.friendEmail) {
          this.usersList = user.map(item => item['email']);
          console.log(this.usersList);            
          const order = this.usersList.indexOf(this.friendEmail);
          if (order >=0) {         
            this.toastr.success('New friend successfully added');
            this.friendsList.push(this.friendEmail);
            this.activeUser.friendsList = this.friendsList;
            console.log(2, this.activeUser)
            localStorage.setItem('currentUser', JSON.stringify(this.activeUser));
            this.friendEmail = ''
            this.isShowAddFriend = !this.isShowAddFriend;
            console.log(this.friendsList)
          } else {        
          this.toastr.info('No such user');        
      }
        }        
    })
    }    
  }

  deleteFriend(email:string): void {    
    const number = this.friendsList.indexOf(email);    
    console.log(1, number);    
    this.friendsList.splice(number, 1);
    this.activeUser.friendsList = this.friendsList;
    localStorage.setItem('currentUser', JSON.stringify(this.activeUser));
  }
  
  }
  