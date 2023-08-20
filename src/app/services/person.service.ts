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

}
