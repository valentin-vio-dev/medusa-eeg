import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import Record from 'src/app/models/Record';

@Injectable({
  providedIn: 'root'
})
export class RecordService {
  signals: any[] = [];

  constructor() { }

  addSignals(data: any[]) {
    this.signals.push(data);
  }

  
}
