import { Pipe, PipeTransform } from '@angular/core';
import { IMovie } from '../interfaces/movies.interface';

@Pipe({
  name: 'search',
  pure: false
})
export class SearchPipe implements PipeTransform {

  transform(moviesArray: IMovie[], field: string): IMovie[] {
    if (!moviesArray) return [];
    if (!field) return moviesArray;
    return moviesArray.filter(movie => movie.title.toLowerCase().includes(field.toLowerCase()));
  }

}
