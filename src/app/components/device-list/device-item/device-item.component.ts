import { Component, Input, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import Device from 'src/app/models/Device';

@Component({
  selector: 'app-device-item',
  templateUrl: './device-item.component.html',
  styleUrls: ['./device-item.component.scss'],
  
})
export class DeviceItemComponent implements OnInit {
  @Input() device: Device;

  constructor(public alertController: AlertController) { }

  ngOnInit() {}

  connect() {
    this.device.connect().then(() => {

    }).catch((err) => {
      this.connectionFailed(err);
    });
  }

  async connectionFailed(text: string) {
    const alert = await this.alertController.create({
      header: 'Error',
      message: text
    });

    await alert.present();
  }

}
