import { Component, Inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-translate-dialog',
  templateUrl: './translate-dialog.component.html',
  styleUrls: ['./translate-dialog.component.scss']
})
export class TranslateDialogComponent {

  constructor(  
    private dialogRef: MatDialogRef<TranslateDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {plot_ukr: string}
  ) {}
  
  closeProfileDialog(): void {
    this.dialogRef.close();
  }

}