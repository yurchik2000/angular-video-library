import { Pipe, PipeTransform } from '@angular/core';
import { IMovie } from '../interfaces/movies.interface';

@Pipe({
  name: 'filterbyfavourite'
})
export class FilterbyfavouritePipe implements PipeTransform {

  transform(moviesArray: IMovie[], favourite: boolean): IMovie[] {
    if (!moviesArray) return [];
    if (!favourite) return moviesArray;        
    return moviesArray.filter(movie => movie.favourite === favourite);
  }

}
