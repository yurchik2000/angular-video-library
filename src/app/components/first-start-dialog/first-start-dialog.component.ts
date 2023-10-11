import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';


@Component({
  selector: 'app-first-start-dialog',
  templateUrl: './first-start-dialog.component.html',
  styleUrls: ['./first-start-dialog.component.scss']
})
export class FirstStartDialogComponent {

  constructor(
    private dialogRef: MatDialogRef<FirstStartDialogComponent>,    
  ) {}

  closeActorDialog(): void {
    this.dialogRef.close();
  }

}
