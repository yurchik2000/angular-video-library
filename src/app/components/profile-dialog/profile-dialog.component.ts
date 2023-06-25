import { Component } from '@angular/core';
import { Firestore, doc, setDoc } from '@angular/fire/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { IUser } from 'src/app/interfaces/movies.interface';
import { ImageService } from 'src/app/services/image.service';
import { ImageCroppedEvent, LoadedImage, base64ToFile } from 'ngx-image-cropper';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-profile-dialog',
  templateUrl: './profile-dialog.component.html',
  styleUrls: ['./profile-dialog.component.scss']
})


export class ProfileDialogComponent {

  public profileForm!:  FormGroup;
  public isUploaded = true;
  public imageChangedEvent: any = '';
  public croppedImage: any = '';
  public file!: any;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ProfileDialogComponent>,
    private afs: Firestore,
    private imageService: ImageService,    
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
    const productImageToUpload = new File([base64ToFile(this.croppedImage)], this.file.name, {lastModified: this.file.lastModified, type: this.file.type});    
    this.imageService.uploadFile('images/avatars', this.file.name, productImageToUpload)
      .then(data => {
        console.log('datas ',data);
        this.profileForm.patchValue({
          imagePath: data
        })
        console.log('success');
        const { email, name, imagePath } = this.profileForm.value;
        // console.log('save data', email, name, imagePath);
        const user: IUser = JSON.parse(localStorage.getItem('currentUser') as string);
        user.name = name;
        user.poster = imagePath;    
        localStorage.setItem('currentUser', JSON.stringify(user));
        setDoc(doc(this.afs, 'users', user.uid), user);    
        this.dialogRef.close();
        this.isUploaded = true;
      })
      .catch (error => {
        console.error('error', error)        
      })
  }
      
    valueByControl(control: string): string {
      return this.profileForm.get(control)?.value;
    }

    fileChangeEvent(event: any): void {
      this.imageChangedEvent = event;      
      this.file = event.target.files[0];
    }
    imageCropped(event: ImageCroppedEvent) {      
      this.croppedImage = event.base64;                              
      // event.blob can be used to upload the cropped image
    }
    imageLoaded(image: LoadedImage) {      
        // show cropper
    }
    cropperReady() {
        // cropper ready
    }
    loadImageFailed() {
        // show message
    }      

}
