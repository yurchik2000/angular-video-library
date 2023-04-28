import { Pipe, PipeTransform } from '@angular/core';
import { IMovie } from '../interfaces/movies.interface';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(moviesArray: IMovie[], field: string): IMovie[] {
    if (!moviesArray) return [];
    if (!field) return moviesArray;            
    return moviesArray.filter(movie => movie.genres.includes(field));
  }

}
