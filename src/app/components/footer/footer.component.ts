import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog'
import { HelpDialogComponent } from '../help-dialog/help-dialog.component';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {

  constructor(
    private dialog: MatDialog
  ) {}

  clearLocalStorage(): void {
    if (localStorage.getItem('movies')) {
      localStorage.removeItem('movies');
      console.log('Local storage is clear')
    }; 
  }

  openHelpWindow(): void {         
    this.dialog.open(HelpDialogComponent, {
      backdropClass: 'dialog-back',
      panelClass: 'profile-dialog',
      autoFocus: false,      
      width: '90%'   
    })
  }

}

