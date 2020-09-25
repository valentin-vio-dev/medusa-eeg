import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import Record from 'src/app/models/Record';

@Injectable({
  providedIn: 'root'
})
export class RecordService {
  record: Record = new Record();
  cloudSaveEnabled: boolean = false;

  constructor(private fireStore: AngularFirestore) { }

  saveRecord() {
    if (!this.cloudSaveEnabled) return;
    this.record.saveToFirestore(this.fireStore);
  }
}
