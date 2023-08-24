import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PersonService {

  private url = environment.BACKEND_URL_TMDB;
  private options = {
    method: 'GET',
    headers: {
      accept: 'application/json',      
      Authorization: `Bearer ${environment.API_TOKEN_TMDB}`
  }
  }  

  constructor(
    private http: HttpClient
  ) { }

  getPeson(query: string): Observable<any> {
    return this.http.get<any>(`${this.url}search/person?query=${query}`, this.options)
  }

  searchMovieTmdb(query: string): Observable<any> {
    return this.http.get<any>(`${this.url}search/multi?query=${query}`, this.options)
  }

  getMovieCast(tmdbId: string): Observable<any> {
    return this.http.get<any>(`${this.url}movie/${tmdbId}/credits?query=${tmdbId}`, this.options)
  }

  getTvCast(tmdbId: string): Observable<any> {
    return this.http.get<any>(`${this.url}tv/${tmdbId}/credits?query=${tmdbId}`, this.options)
  }

  getTvMoreLikeThis(tmdbId: string): Observable<any> {
    return this.http.get<any>(`${this.url}tv/${tmdbId}/recommendations`, this.options)
  }

  getMovieMoreLikeThis(tmdbId: string): Observable<any> {
    return this.http.get<any>(`${this.url}movie/${tmdbId}/recommendations`, this.options)
  }



}
