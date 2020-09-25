import { Component, OnInit } from '@angular/core';
import { ActionSheetController } from '@ionic/angular';
import { DeviceService } from '../services/device-service/device.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  scanTime: number = 5000;
  scanning: boolean = false;

  constructor(public actionSheetController: ActionSheetController, public deviceService: DeviceService) {}

  ngOnInit(): void {
    
  }

  scan() {
    if (this.scanning) return;

    this.scanning = true;
    this.deviceService.scan(this.scanTime);
    setTimeout(() => {
      this.scanning = false;
    }, this.scanTime);
  }

  async scanTimeSettings() {
    if (this.scanning) return;
    
    const actionSheet = await this.actionSheetController.create({
      header: 'Scan time',
      buttons: [{
        text: '1 second' + (this.scanTime == 1000 ? ' (Current)' : ''),
        handler: () => {
          this.scanTime = 1000;
        }
      }, {
        text: '2 second' + (this.scanTime == 2000 ? ' (Current)' : ''),
        handler: () => {
          this.scanTime = 2000;
        }
      }, {
        text: '5 second' + (this.scanTime == 5000 ? ' (Current)' : ''),
        handler: () => {
          this.scanTime = 5000;
        }
      }, {
        text: '10 second' + (this.scanTime == 10000 ? ' (Current)' : ''),
        handler: () => {
          this.scanTime = 10000;
        }
      }]
    });
    await actionSheet.present();
  }

}
