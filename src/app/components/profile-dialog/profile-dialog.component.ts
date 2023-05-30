import { Component } from '@angular/core';
import { Firestore, doc, setDoc } from '@angular/fire/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { IUser } from 'src/app/interfaces/movies.interface';

@Component({
  selector: 'app-profile-dialog',
  templateUrl: './profile-dialog.component.html',
  styleUrls: ['./profile-dialog.component.scss']
})


export class ProfileDialogComponent {

  public profileForm!:  FormGroup;


  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ProfileDialogComponent>,
    private afs: Firestore,
  ) {}

  ngOnInit() {
    this.initProfileForm();  
  }

  initProfileForm(): void {
    const user: IUser = JSON.parse(localStorage.getItem('currentUser') as string);
    this.profileForm = this.fb.group( {
      email: [user.email, Validators.required],
      name: [user.name, Validators.required],
      imagePath: [null]
    })
  }

  closeProfileDialog(): void {
    this.dialogRef.close();
  }

  saveUserToFirestore(): void {
    const { email, name } = this.profileForm.value;
    // console.log('save data', email, name);
    const user: IUser = JSON.parse(localStorage.getItem('currentUser') as string);
    user.name = name;
    // console.log(user);    
    localStorage.setItem('currentUser', JSON.stringify(user));
    setDoc(doc(this.afs, 'users', user.uid), user);    
    this.dialogRef.close();
  }


}
