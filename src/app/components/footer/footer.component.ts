import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {

  clearLocalStorage(): void {
    if (localStorage.getItem('movies')) {
      localStorage.removeItem('movies');
      console.log('Local storage is clear')
    }; 
  }

}

