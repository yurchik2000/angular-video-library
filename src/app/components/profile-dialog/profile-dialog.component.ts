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
    private sanitizer: DomSanitizer    
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

  // upload(event: any) : void {

    // const file = event.target.files[0];
    // console.log(1, file);
    
    // const productImageToUpload = new File([base64ToFile(this.croppedImage)], file.name, {lastModified: file.lastModified, type: file.type});
    // this.imageService.uploadFile('images/avatars', file.name, productImageToUpload)    

    // this.imageService.uploadFile('images/avatars', file.name, productImageToUpload)
    //   .then(data => {
    //     console.log('datas ',data);
    //     this.profileForm.patchValue({
    //       imagePath: data
    //     })
    //     console.log('success');
    //     this.isUploaded = true;
    //   })
    //   .catch (error => {
    //     console.error('error', error)        
    //   })
    // }

    // deleteImage(): void {
    //   this.imageService.deleteUploadFile(this.valueByControl('imagePath')).then(() => {
    //     console.log('File deleted');
    //     this.isUploaded = false;        
    //     this.profileForm.patchValue({
    //       imagePath: null
    //     })
    //     const user: IUser = JSON.parse(localStorage.getItem('currentUser') as string);        
    //     user.poster = '';    
    //     localStorage.setItem('currentUser', JSON.stringify(user));        
    //   })
    // }

    valueByControl(control: string): string {
      return this.profileForm.get(control)?.value;
    }

    fileChangeEvent(event: any): void {
      this.imageChangedEvent = event;      
      this.file = event.target.files[0];
    }
    imageCropped(event: ImageCroppedEvent) {
      // console.log(3, event);      
      this.croppedImage = event.base64;
      // console.log(this.croppedImage)
      // var originalimageFile = this.imageChangedEvent.target.files[0];
      // if(originalimageFile){
      //   var productImageToUpload = new File([base64ToFile(this.croppedImage)], originalimageFile.name, {lastModified: originalimageFile.lastModified, type: originalimageFile.type});
      //   this.imageService.uploadFile('images/avatars', 'test.png', productImageToUpload)
      // }
                        
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
