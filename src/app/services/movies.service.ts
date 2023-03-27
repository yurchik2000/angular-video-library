import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IMovieResponce } from '../interfaces/movies.interface';

@Injectable({
  providedIn: 'root'
})
export class MoviesService {

  private url = environment.BACKEND_URL;
  private apiKey = environment.API_KEY;

  constructor(
    private http: HttpClient
  ) { }

  ngOnInit() {

  }

  getOneMovie(movieId: string): Observable<IMovieResponce> {
    return this.http.get<IMovieResponce>(`${this.url}?apikey=${this.apiKey}&i=${movieId}`)
  }


}
