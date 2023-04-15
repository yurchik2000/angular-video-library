import { Pipe, PipeTransform } from '@angular/core';
import { IMovie } from '../interfaces/movies.interface';

@Pipe({
  name: 'filterbydirector'
})
export class FilterbydirectorPipe implements PipeTransform {

  transform(moviesArray: IMovie[], field: string): IMovie[] {
    if (!moviesArray) return [];
    if (!field) return moviesArray;        
    return moviesArray.filter(movie => movie.director.includes(field));
  }

}
