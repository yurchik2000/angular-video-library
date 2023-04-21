import { Component } from '@angular/core';
import { Auth, UserCredential, signInWithEmailAndPassword } from '@angular/fire/auth';
import { Firestore, docData } from '@angular/fire/firestore';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { doc } from '@firebase/firestore';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { MoviesService } from 'src/app/services/movies.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})

export class AuthComponent {
  public authForm!: FormGroup;  
  public loginSubscription?: Subscription;  

  constructor(
    private fb: FormBuilder,
    private auth: Auth,
    private afs: Firestore,
    private router: Router,
    private movieService: MoviesService
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
    console.log(this.authForm.value);
    this.login(email, password)
      .then (() => {
        console.log('login done');                
        this.movieService.activeUser = {
          name: '',
          email: email,
          poster: ''
        }
        this.changeActiveUser();
      })
      .catch ( error => {
        console.log(error)
      })
    this.authForm.reset();
  }
  
  async login(email: string, password: string): Promise<void> {
    const credential = await signInWithEmailAndPassword(this.auth, email, password);    
    console.log(credential.user.uid);
    this.loginSubscription = docData(doc(this.afs, 'users', credential.user.uid)).subscribe(user => {
      const currentUser = { ...user, uid: credential.user.uid, email: email };
      localStorage.setItem('currentUser', JSON.stringify(currentUser));      
      this.router.navigate(['']);
    },
    (error) => {console.log(error)}
    )
  }

  changeActiveUser(): void {            
    this.movieService.changeActiveUser.next(true); 
  };


}

