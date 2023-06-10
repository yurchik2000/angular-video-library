import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule} from '@angular/common/http'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { MainComponent } from './components/main/main.component';
import { AuthComponent } from './components/auth/auth.component';
import { SearchComponent } from './components/search/search.component';
import { ProfileComponent } from './components/profile/profile.component';
import { FooterComponent } from './components/footer/footer.component';

import { SearchPipe } from './pipes/search.pipe';
import { SortPipe } from './pipes/sort.pipe';
import { FilterPipe } from './pipes/filter.pipe';
import { FilterbydirectorPipe } from './pipes/filterbydirector.pipe';
import { FilterbyfavouritePipe } from './pipes/filterbyfavourite.pipe';
import { SortbyactorPipe } from './pipes/sortbyactor.pipe';
import { NgxPaginationModule } from 'ngx-pagination'; // <-- import the module
import { ToastNoAnimationModule, ToastrModule } from 'ngx-toastr';
import { StarRatingModule } from 'angular-star-rating';


import { initializeApp,provideFirebaseApp } from '@angular/fire/app';
import { provideAuth,getAuth } from '@angular/fire/auth';
import { provideStorage,getStorage } from '@angular/fire/storage';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';


import { environment } from '../environments/environment';
import { MovieInfoComponent } from './components/movie-info/movie-info.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from './shared/shared.module';
import { ProfileDialogComponent } from './components/profile-dialog/profile-dialog.component';
import { FriendInfoComponent } from './components/friend-info/friend-info.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    MainComponent,
    SearchPipe,
    SearchComponent,
    SortPipe,
    FilterPipe,
    FilterbydirectorPipe,    
    SortbyactorPipe,
    FooterComponent,
    AuthComponent,
    ProfileComponent,
    MovieInfoComponent,
    ProfileDialogComponent,
    FriendInfoComponent,
    FilterbyfavouritePipe,
    PageNotFoundComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    NgxPaginationModule,
    ToastrModule,
    ReactiveFormsModule,
    ToastNoAnimationModule.forRoot({
      timeOut: 1000,
    }),
    StarRatingModule.forRoot(),
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideStorage(() => getStorage()),
    provideFirestore(() => getFirestore()),
    BrowserAnimationsModule,
    SharedModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
