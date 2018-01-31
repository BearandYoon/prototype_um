import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';

import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase';

import { SharedService } from '../../../_core/services/shared.service';
import { FileUpload } from '../../../_core/interfaces/file-upload';
import { IUser } from '../../../_core/interfaces/user';

@Component({
  selector: 'app-file-uploader',
  templateUrl: './file-uploader.component.html',
  styleUrls: ['./file-uploader.component.scss']
})
export class FileUploaderComponent implements OnInit {
  selectedFiles: FileList;
  currentFileUpload: FileUpload;
  progress: {percentage: number} = {percentage: 0};
  basePath = '/uploads';
  uid = '';

  @Output() fileUploadSuccess: EventEmitter<FileUpload> = new EventEmitter();

  constructor(
    private sharedService: SharedService,
    private afAuth: AngularFireAuth,
  ) { }

  ngOnInit() {
  }

  selectFile(event) {
    this.selectedFiles = event.target.files;
  }

  async upload() {
    const user: IUser = this.sharedService.getUser();
    if (!user.id) {
      await this.afAuth.authState.first().toPromise();
      this.uid = this.afAuth.auth.currentUser.uid;
    } else {
      this.uid = user.id;
    }

    const file = this.selectedFiles.item(0);
    this.currentFileUpload = new FileUpload(file);
    this.pushFileToStorage(this.currentFileUpload, this.progress);
  }

  pushFileToStorage(fileUpload: FileUpload, progress: {percentage: number}) {
    const storageRef = firebase.storage().ref();
    const uploadTask = storageRef.child(`${this.basePath}/${this.uid}/${new Date().getTime().toString()}`)
      .put(fileUpload.file, {contentType: fileUpload.file.type});

    uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
      (snapshot) => {
        // in progress
        const snap = snapshot as firebase.storage.UploadTaskSnapshot;
        progress.percentage = Math.round((snap.bytesTransferred / snap.totalBytes) * 100);
      },
      (error) => {
        // fail
        console.log(error);
      },
      () => {
        // success
        fileUpload.url = uploadTask.snapshot.downloadURL;
        fileUpload.name = fileUpload.file.name;
        this.fileUploadSuccess.emit(fileUpload);
      }
    );
  }
}
