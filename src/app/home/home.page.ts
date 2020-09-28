import { AfterViewInit, Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { ActionSheetController } from '@ionic/angular';
import { DeviceService } from '../services/device-service/device.service';
import { Plugins } from "@capacitor/core";
import { MedusaChartComponent } from '../components/medusa-chart/medusa-chart.component';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, AfterViewInit {
  scanTime: number = 5000;
  scanning: boolean = false;
  @ViewChildren("chart") charts: MedusaChartComponent[];
  channels: string[] = ['F3', 'FC5', 'AF3', 'F7', 'T7', 'P7', 'O1', 'O2', 'P8', 'T8', 'F8', 'AF4', 'FC6', 'F4'];
  channelComponents: any[] = [];

  constructor(public actionSheetController: ActionSheetController, public deviceService: DeviceService) {}

  ngAfterViewInit(): void {

  }

  ngOnInit(): void {
    //this.addRandomPoints();
    Plugins.EEGBridge.addListener('eeg_data', (res: any) => {
      let data = res['data'].split(',');
      for (let i=0; i<this.charts['_results'].length; i++) {
        this.addPoint(this.charts['_results'][i], parseFloat(data[i]))
      }
      
    });
  }

  addRandomPoints(chart) {
    setInterval(() => {
      chart.addPoint(Math.floor(Math.random() * 200 + 4000));
    }, 1000/127)
  }

  addPoint(chart, point) {
    chart.addPoint(point);
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

  arrayFromString(arr: string) {
    return arr.split(',').map((value) => {
        return parseFloat(value);
    });
  }

}
