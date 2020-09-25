import { AngularFirestore, DocumentReference } from 'angularfire2/firestore';
import Signal from './Signal';

export default class Record {
    signals: Signal[];
    start: number;
    end: number;

    recordDocumentRef: DocumentReference;

    constructor() {
        this.signals = [];
        this.start = Date.now();
    }

    add(signal: Signal) {
        this.signals.push(signal);
    }

    async saveToFirestore(fireStore: AngularFirestore) {
        this.end = Date.now();
        this.recordDocumentRef = await fireStore.collection('records').add({
            start: this.start
        });

        this.signals.forEach(signal => {
            this.recordDocumentRef.collection('signals').add({
                time: signal.time,
                eeg: this.prepareArray(signal.eeg),
                eegConverted: this.prepareArray(signal.eegConverted),
                gyro: this.prepareArray(signal.gyro),
                gyroConverted: this.prepareArray(signal.gyroConverted)
            })
        });
    }

    prepareArray(arr: any[]) {
        if (arr != undefined && arr.length > 0) {
            return arr;
        }
        return null;
    }

}