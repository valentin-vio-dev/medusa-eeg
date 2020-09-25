import { Injectable } from '@angular/core';
import Device from 'src/app/models/Device';
import { Plugins } from "@capacitor/core";

@Injectable({
  providedIn: 'root'
})
export class DeviceService {
  devices: Device[] = [];

  constructor() {
    this.addDevices([new Device("EPOC+ (A5FGRE)", "XE:36:S2:37"), new Device("EPOC+ (X4G582)", "12:RV:4V:F4")]);
  }

  scan(time: number) {
    this.clearDevices();
    Plugins.EEGBridge.scan({time}).then(() => {
      Plugins.EEGBridge.addListener("scanResult", (result: any) => {
        let device = new Device(result.name, result.address);
        this.devices.push(device);
      });
    }).catch(() => {
      console.log('EEGBridge error');
    });
  }

  clearDevices() {
    this.devices = [];
  }

  addDevices(devs) {
    setTimeout(() => {
      this.devices.push(devs.shift());
      if (devs.length > 0) {
        this.addDevices(devs);
      }
    }, 1000);
  }
}
