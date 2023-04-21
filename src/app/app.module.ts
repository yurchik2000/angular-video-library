import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule} from '@angular/common/http'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { MainComponent } from './components/main/main.component';
import { AuthComponent } from './components/auth/auth.component';
import { SearchPipe } from './pipes/search.pipe';
import { SearchComponent } from './components/search/search.component';
import { SortPipe } from './pipes/sort.pipe';
import { FilterPipe } from './pipes/filter.pipe';
import { FilterbydirectorPipe } from './pipes/filterbydirector.pipe';
import { SortbyactorPipe } from './pipes/sortbyactor.pipe';
import { NgxPaginationModule } from 'ngx-pagination'; // <-- import the module
import { ToastNoAnimationModule, ToastrModule } from 'ngx-toastr';
import { StarRatingModule } from 'angular-star-rating';
import { FooterComponent } from './components/footer/footer.component';
import { initializeApp,provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';

import { provideAuth,getAuth } from '@angular/fire/auth';
import { provideStorage,getStorage } from '@angular/fire/storage';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';


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
    AuthComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    NgxPaginationModule,
    ToastrModule,
    ReactiveFormsModule,
    ToastNoAnimationModule.forRoot(),
    StarRatingModule.forRoot(),
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideStorage(() => getStorage()),
    provideFirestore(() => getFirestore()) 
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
