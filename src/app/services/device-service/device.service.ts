import { Injectable } from '@angular/core';
import Device from 'src/app/models/Device';
import { PluginListenerHandle, Plugins } from "@capacitor/core";
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DeviceService {
  devices: Device[] = [];
  scannerListener: any;

  constructor() { }

  scan(time: number) {
    this.clearDevices();

    this.scannerListener = Plugins.EEGBridge.addListener('device_scan_result', (result: any) => {
      this.devices.push(new Device(result.name, result.address));
    });

    Plugins.EEGBridge.scan({time}).then(() => {
      this.scannerListener.remove();
    }).catch(() => {
      console.log('EEGBridge error');
    });
  }

  clearDevices() {
    this.devices = [];
  }

}
