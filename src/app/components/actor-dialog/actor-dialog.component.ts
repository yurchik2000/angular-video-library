import { Component, Inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-actor-dialog',
  templateUrl: './actor-dialog.component.html',
  styleUrls: ['./actor-dialog.component.scss']
})
export class ActorDialogComponent {

  constructor(
    private dialogRef: MatDialogRef<ActorDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {poster: string, name: string}
  ) {}

  closeActorDialog(): void {
    this.dialogRef.close();
  }

}
