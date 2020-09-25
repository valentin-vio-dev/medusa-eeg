import { Component, Input, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import Device from 'src/app/models/Device';
import { AngularFirestore } from 'angularfire2/firestore';
import { firestore } from 'firebase';

@Component({
  selector: 'app-device-item',
  templateUrl: './device-item.component.html',
  styleUrls: ['./device-item.component.scss'],
  
})
export class DeviceItemComponent implements OnInit {
  @Input() device: Device;

  constructor(public alertController: AlertController, private fireStore: AngularFirestore) { }

  ngOnInit() {}

  connect() {
    if (!this.device.connected) {
      this.device.connect().then(() => {
        this.device.addEEGDataListener(this.fireStore);
      }).catch((err) => {
        this.connectionFailed(err);
      });
    } else {
      this.device.disconnect();
    }
    
  }

  async connectionFailed(text: string) {
    const alert = await this.alertController.create({
      header: 'Error',
      message: text
    });

    await alert.present();
  }

}
