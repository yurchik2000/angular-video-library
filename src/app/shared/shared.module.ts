import { NgModule } from "@angular/core";

import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

const MATERIAL = [
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
]

@NgModule({
    declarations: [],
    imports: [
        ...MATERIAL
    ],
    exports: [
        ...MATERIAL
    ]
})

export class SharedModule {}