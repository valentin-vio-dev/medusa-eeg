import { Component, Input, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import Device from 'src/app/models/Device';
import { AngularFirestore } from 'angularfire2/firestore';
import { firestore } from 'firebase';
import { NavigationExtras, Router } from '@angular/router';

@Component({
  selector: 'app-device-item',
  templateUrl: './device-item.component.html',
  styleUrls: ['./device-item.component.scss'],
  
})
export class DeviceItemComponent implements OnInit {
  @Input() device: Device;

  constructor(public alertController: AlertController, private router: Router) { }

  ngOnInit() {}

  connect() {
    if (!this.device.connected) {
      this.device.connect().then(() => {
        let extras: NavigationExtras = {
          queryParams: {
            deviceName: this.device.name,
            deviceAddress: this.device.address
          }
        };
        this.router.navigate(['/connected-device'], extras);
      }).catch((err) => {
        //this.connectionFailed(err);
        let extras: NavigationExtras = {
          queryParams: {
            deviceName: this.device.name,
            deviceAddress: this.device.address
          }
        };
        this.router.navigate(['/connected-device'], extras).then(() => {
          /*let audio = new Audio();
          audio.src = 'assets/sounds/connected.wav';
          audio.load();
          audio.play();*/
        });
      });
    } else {
      this.device.disconnect().then(() => {
        
      }).catch((err) => {
        this.connectionFailed(err);
      });
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
