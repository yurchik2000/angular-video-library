import { Component, Inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';


@Component({
  selector: 'app-first-start-dialog',
  templateUrl: './first-start-dialog.component.html',
  styleUrls: ['./first-start-dialog.component.scss']
})
export class FirstStartDialogComponent {

  constructor(
    private dialogRef: MatDialogRef<FirstStartDialogComponent>,
    // @Inject(MAT_DIALOG_DATA) public data: {poster: string, name: string}
  ) {}

  closeActorDialog(): void {
    this.dialogRef.close();
  }

}
