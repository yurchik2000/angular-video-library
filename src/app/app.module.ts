import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule} from '@angular/common/http'
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { MainComponent } from './components/main/main.component';
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
    FooterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    NgxPaginationModule,
    ToastrModule,
    ToastNoAnimationModule.forRoot(),
    StarRatingModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
