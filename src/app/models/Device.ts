import { Plugins } from "@capacitor/core";
import Record from './Record';
import Signal from './Signal';

import { AngularFirestore, DocumentReference } from 'angularfire2/firestore';
import { RecordService } from '../services/record-service/record.service';

export default class Device {
    name: string;
    address: string;
    connected: boolean;
    battery: number;

    eegDataListener: any;
    firestore: AngularFirestore;

    firestoreDocRef: DocumentReference;

    constructor(name: string, address: string) {
        this.name = name;
        this.address = address;
        this.connected = false;
    }

    connect() {
        return new Promise(async (resolve, reject) => {
            await Plugins.EEGBridge.connect({device_address: this.address}).then(() => {
                this.connected = true;
                resolve();
            }).catch((err) => {
                this.connected = false;
                reject(err);
            });
        });
    }

    disconnect() {
        if (this.eegDataListener != null) {
            this.removeEEGDataListener();
        }
        
        return new Promise(async (resolve, reject) => {
            await Plugins.EEGBridge.disconnect({device_address: this.address}).then(() => {
                this.connected = false;
                resolve();
            }).catch((err) => {
                this.connected = false;
                reject(err);
            });
        });
    }

    async addEEGDataListener(firestore: AngularFirestore) {
        /*this.firestoreDocRef = await firestore.collection('records').add({
            device: { 
                name: this.name,
                address: this.address
            }
        });
        
        this.eegDataListener = Plugins.EEGBridge.addListener('eeg_data', (res: any) => {
            this.firestoreDocRef.collection('signals').add({
                time: Date.now(),
                data: this.arrayFromString(res.data)
            });
        });*/
    }

    removeEEGDataListener() {
        this.eegDataListener.remove();
    }

    arrayFromString(arr: string) {
        return arr.split(',').map((value) => {
            return parseFloat(value);
        });
    }
}