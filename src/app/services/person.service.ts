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
    return this.http.get<any>(`${this.url}find/${query}?external_source=imdb_id&language=uk-Uk`, this.options)
  }

  getMovieCast(tmdbId: string): Observable<any> {
    return this.http.get<any>(`${this.url}movie/${tmdbId}/credits?query=${tmdbId}`, this.options)
  }

  getTvCast(tmdbId: string): Observable<any> {
    return this.http.get<any>(`${this.url}tv/${tmdbId}/aggregate_credits?query=${tmdbId}`, this.options)
  }

  getTvRecommendations(tmdbId: string): Observable<any> {
    return this.http.get<any>(`${this.url}tv/${tmdbId}/recommendations?language=en-US&page=1`, this.options)
  }

  getMovieRecommendations(tmdbId: string): Observable<any> {
    return this.http.get<any>(`${this.url}movie/${tmdbId}/recommendations?language=en-US`, this.options)
  }

  getTvMoreLikeThis(tmdbId: string): Observable<any> {
    return this.http.get<any>(`${this.url}tv/${tmdbId}/similar?language=en-US`, this.options)
  }

  getMovieMoreLikeThis(tmdbId: string): Observable<any> {
    return this.http.get<any>(`${this.url}movie/${tmdbId}/similar?language=en-US`, this.options)
  }

  getImdbId(tmdbId: string, type:string): Observable<any> {
    if (type === 'movie') {
       return this.http.get<any>(`${this.url}movie/${tmdbId}/external_ids`, this.options)
    } else {
       return this.http.get<any>(`${this.url}tv/${tmdbId}/external_ids`, this.options)
    }
      
  }



}
