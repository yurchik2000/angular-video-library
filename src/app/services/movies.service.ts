import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IMovieResponce } from '../interfaces/movies.interface';

@Injectable({
  providedIn: 'root'
})
export class MoviesService {

  private url = environment.BACKEND_URL;
  private apiKey = environment.API_KEY;
  public inputMovieTitle = "";
  public changeMovieTitle = new Subject<boolean>();

  constructor(
    private http: HttpClient
  ) { }

  ngOnInit() {

  }

  getOneMovie(movieId: string): Observable<IMovieResponce> {
    return this.http.get<IMovieResponce>(`${this.url}?apikey=${this.apiKey}&i=${movieId}`)
  }

  getMoviesList(title: string): Observable<IMovieResponce[]> {
    return this.http.get<IMovieResponce[]>(`${this.url}?apikey=${this.apiKey}&s=${title}`)
  }

}
