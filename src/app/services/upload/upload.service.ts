import { Injectable } from '@angular/core';
import { AngularFireStorage } from "@angular/fire/storage";
import { finalize } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class UploadService {

  constructor(private storage: AngularFireStorage) { }

  deleteFileStorage(name: string) {
    return this.storage.storage.refFromURL(name).delete();
  }

  uploadFileStorage(file) {
   
  }

}
