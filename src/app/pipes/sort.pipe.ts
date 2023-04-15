import { Pipe, PipeTransform } from '@angular/core';
import { IMovie } from '../interfaces/movies.interface';

@Pipe({
  name: 'sort',
  pure: false
})
export class SortPipe implements PipeTransform {

  transform(moviesArray: IMovie[], sortDirection:boolean): IMovie[] {
    if (!moviesArray) return [];
    if (sortDirection) return moviesArray; else    
    return moviesArray.reverse();
  }


}
