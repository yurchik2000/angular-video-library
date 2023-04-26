import { Component } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from '@angular/fire/auth';
import { Firestore, docData, setDoc } from '@angular/fire/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { doc } from '@firebase/firestore';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { MoviesService } from 'src/app/services/movies.service';
import { ToastrService } from 'ngx-toastr';
import { IMovie } from 'src/app/interfaces/movies.interface';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})

export class AuthComponent {
  public authForm!: FormGroup;  
  public loginSubscription?: Subscription;  
  public isLogin = false;

  constructor(
    private fb: FormBuilder,
    private auth: Auth,
    private afs: Firestore,
    private router: Router,
    private movieService: MoviesService,
    private toastr: ToastrService,    
  ) {}

  ngOnInit(){
    this.initAuthForm();    
  }

  ngOnDestroy() {
    this.loginSubscription?.unsubscribe();
  }

  initAuthForm(): void {
    this.authForm = this.fb.group({
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required]]
    })
  }
  
  signIn(): void {
    const { email, password } = this.authForm.value;        
    this.login(email, password)
      .then (() => {
        this.toastr.success('User successfully login');
        this.movieService.activeUser = {
          name: '',
          email: email,
          poster: ''
        }
        this.changeActiveUser();
      })
      .catch ( error => {
        this.toastr.error(error.code);        
      })
    this.authForm.reset();
  }
  
  async login(email: string, password: string): Promise<void> {
    const credential = await signInWithEmailAndPassword(this.auth, email, password);        
    this.loginSubscription = docData(doc(this.afs, 'users', credential.user.uid)).subscribe(user => {
      const currentUser = { ...user, uid: credential.user.uid, email: email };
      localStorage.setItem('currentUser', JSON.stringify(currentUser));    
      this.router.navigate(['']);
    },
    (error) => {
      this.toastr.error(error.code);
    }
    )
  }
  changeActiveUser(): void {            
    this.movieService.changeActiveUser.next(true); 
  };
  changeIsLogin(): void {
    this.isLogin = !this.isLogin;
  }
  registerUser(): void {
    const { email, password } = this.authForm.value;    
    this.emailSignUp(email, password)
      .then(()=> {
        this.toastr.success('User successfully created');
        this.isLogin = !this.isLogin;
        this.authForm.reset();
      })
      .catch(error => {
        this.toastr.error(error.code);
      });        
  }
  async emailSignUp(email: string, password: string): Promise<void> {
    const credential = await createUserWithEmailAndPassword(this.auth, email, password);        
    const list = JSON.parse(localStorage.getItem('movies') || '');
    const moviesListId = list.map( (item:IMovie) => (item.id));    
    const user = {
      email: credential.user.email,
      poster: '',
      name: '',
      myMovieId: moviesListId,      
    };
    console.log(user);
    setDoc(doc(this.afs, 'users', credential.user.uid), user);
    console.log(credential);    
  }


}

