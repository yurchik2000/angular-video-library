import { Component } from '@angular/core';
import { Firestore, setDoc, collection, collectionData, docData, addDoc } from '@angular/fire/firestore';
import { doc } from '@firebase/firestore';
import { Router } from '@angular/router';
import { IMovie, IUser } from 'src/app/interfaces/movies.interface';
import { MoviesService } from 'src/app/services/movies.service';
import { MatDialog } from '@angular/material/dialog'
import { ProfileDialogComponent } from '../profile-dialog/profile-dialog.component';

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
    uid: ''
  }
  public usersList: Array<string> = [];
  public isShowUsers = false;

  constructor(
    private router: Router,
    private movieService: MoviesService,    
    private afs: Firestore,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    if (localStorage.getItem('movies')) this.saveDataToFireStore();
    if (localStorage.getItem('currentUser')) this.getActiveUser();
  }

  logOut(): void {        
    if (localStorage.getItem('movies')) this.saveDataToFireStore();
    localStorage.removeItem('currentUser');    
    this.movieService.activeUser = {
      name: '',
      email: '',
      poster: '',
      moviesId: [],
      uid: ''
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
    const moviesListId = list.map( (item:IMovie) => (item.id));        
    user.myMovieId = moviesListId;            
    setDoc(doc(this.afs, 'users', user.uid), user);             
  }

  getActiveUser(): void {
    if (localStorage.getItem('currentUser')) {      
      this.activeUser = JSON.parse(localStorage.getItem('currentUser') || '');        
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
      console.log(this.usersList);            
    })
  };

  addDataToFireStore(data:any): void {
    const collectionInstance = collection(this.afs, 'users');
    addDoc(collectionInstance, data)
     .then( ()=> {
      console.log('Data saved');
     })
     .catch( (err: any) => {
      console.log(err);      
     })
  }

  changeUsersShow(): void {
    this.isShowUsers = !this.isShowUsers
  }
  openUserEditDialog(): void {
    this.dialog.open(ProfileDialogComponent, {
      backdropClass: 'dialog-back',
      panelClass: 'profile-dialog',
      autoFocus: false
    }).afterClosed().subscribe(result => {
      if (localStorage.getItem('currentUser')) this.getActiveUser();            
    })
  }

}
