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
  
  // getDiscoverMovie():Observable<any> {  
  //   return this.http.get<any>(`${this.url}discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc`, this.options)
  // } 

  getPopularMovie():Observable<any> {  
    return this.http.get<any>(`${this.url}movie/popular?language=en-US&page=1`, this.options)
  } 

  getUpcomingMovie():Observable<any> {  
    return this.http.get<any>(`${this.url}/movie/upcoming?language=en-US&page=1&region=UA`, this.options)
  }  

  getNowPlayingMovie():Observable<any> {  
    return this.http.get<any>(`${this.url}/movie/now_playing?language=en-US&page=1&region=UA`, this.options)
  }
  getTrending():Observable<any> {  
    return this.http.get<any>(`${this.url}/trending/tv/week?language=en-US'`, this.options)
  }    
  getMovieInfo(tmdbId: string): Observable<any> {
    return this.http.get<any>(`${this.url}movie/${tmdbId}?language=en-US'`, this.options)    
  };
  getSeriesInfo(tmdbId: string): Observable<any> {
    return this.http.get<any>(`${this.url}tv/${tmdbId}?language=en-US'`, this.options)    
  }
  getPersonInfo(tmdbId: string): Observable<any> {
    return this.http.get<any>(`${this.url}person/${tmdbId}?language=en-US'`, this.options)    
  }  

// const url = 'https://api.themoviedb.org/3/movie/872585?language=en-US';

 







}
