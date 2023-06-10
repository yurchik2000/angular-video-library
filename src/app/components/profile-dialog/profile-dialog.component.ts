import { Component } from '@angular/core';
import { Firestore, doc, setDoc } from '@angular/fire/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { IUser } from 'src/app/interfaces/movies.interface';
import { ImageService } from 'src/app/services/image.service';

@Component({
  selector: 'app-profile-dialog',
  templateUrl: './profile-dialog.component.html',
  styleUrls: ['./profile-dialog.component.scss']
})


export class ProfileDialogComponent {

  public profileForm!:  FormGroup;
  public isUploaded = true;


  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ProfileDialogComponent>,
    private afs: Firestore,
    private imageService: ImageService
  ) {}

  ngOnInit() {
    this.initProfileForm();  
  }

  initProfileForm(): void {
    const user: IUser = JSON.parse(localStorage.getItem('currentUser') as string);
    this.profileForm = this.fb.group( {
      email: [user.email, Validators.required],
      name: [user.name, Validators.required],
      imagePath: [user.poster, Validators.required]
    })
  }

  closeProfileDialog(): void {
    this.dialogRef.close();
  }

  saveUserToFirestore(): void {
    const { email, name, imagePath } = this.profileForm.value;
    // console.log('save data', email, name);
    const user: IUser = JSON.parse(localStorage.getItem('currentUser') as string);
    user.name = name;
    user.poster = imagePath;
    // console.log(user);    
    localStorage.setItem('currentUser', JSON.stringify(user));
    setDoc(doc(this.afs, 'users', user.uid), user);    
    this.dialogRef.close();
  }

  upload(event: any) : void {
    const file = event.target.files[0];
    console.log(file);
    this.imageService.uploadFile('images/avatars', file.name, file)
      .then(data => {
        console.log('datas ',data);
        this.profileForm.patchValue({
          imagePath: data
        })
        console.log('success');
        this.isUploaded = true;
      })
      .catch (error => {
        console.error('error', error)        
      })
    }

    deleteImage(): void {
      this.imageService.deleteUploadFile(this.valueByControl('imagePath')).then(() => {
        console.log('File deleted');
        this.isUploaded = false;        
        this.profileForm.patchValue({
          imagePath: null
        })
        const user: IUser = JSON.parse(localStorage.getItem('currentUser') as string);        
        user.poster = '';    
        localStorage.setItem('currentUser', JSON.stringify(user));        
      })
    }

    valueByControl(control: string): string {
      return this.profileForm.get(control)?.value;
    }
      

}
