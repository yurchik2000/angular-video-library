import { Injectable } from '@angular/core';
import { deleteObject, getDownloadURL, ref, Storage, uploadBytesResumable } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  constructor(
    private storage: Storage
  ) { }

  async uploadFile(folder:string, name:string, file: File | null): Promise<string> {    
    const path = `${folder}/${name}`;    
    let url = '';
    if (file) {
      try {
        const storageRef = ref(this.storage, path);        
        const task = uploadBytesResumable(storageRef, file);        
        await task;
        url = await getDownloadURL(storageRef);        
      }
      catch (error:any) {
        console.log('error: ', error);
      }
    } else {
      console.log('wrong format')
    }
    return Promise.resolve(url);
  }

  deleteUploadFile(imagePath: string): Promise<void> {
    const task = ref(this.storage, imagePath);
    return deleteObject(task)      
  }
  
}
