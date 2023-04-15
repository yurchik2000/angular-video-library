import { Pipe, PipeTransform } from '@angular/core';
import { IMovie } from '../interfaces/movies.interface';

@Pipe({
  name: 'sort'  
})
export class SortPipe implements PipeTransform {

  transform(moviesArray: IMovie[], sortDirection:boolean): IMovie[] {    
    if (!moviesArray) return [];    
    if (sortDirection) return moviesArray; else {
      let array = [...moviesArray];
      return array.reverse();
    }    
  }


}
