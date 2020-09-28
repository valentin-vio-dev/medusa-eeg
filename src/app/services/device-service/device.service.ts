import { Injectable } from '@angular/core';
import Device from 'src/app/models/Device';
import { PluginListenerHandle, Plugins } from "@capacitor/core";
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DeviceService {
  devices: Device[] = [new Device("EPOC+ (4F32H47)", "B3:6F:C2:L1")];
  scannerListener: any;

  constructor() {
    
  }

  scan(time: number) {
    this.clearDevices();

    

    Plugins.EEGBridge.scan({time}).then(() => {
      setTimeout(() => {
        if (this.scannerListener) {
          this.scannerListener.remove();
        }
      }, time + 100);

      this.scannerListener = Plugins.EEGBridge.addListener('device_scan_result', (result: any) => {
        this.devices.push(new Device(result.name, result.address));
      });
    }).catch(() => {
      console.log('EEGBridge error');
    });
  }

  clearDevices() {
    this.devices = [];
  }

  hasConnectedDevice() {
    this.devices.forEach(device => {
      if (device.connected) {
        return true;
      }
    });
    return false;
  }

  getDeviceByAddress(address: string) {
    let ret = null;
    this.devices.some(device => {
      ret = device;
      return device.address === address;
    });
    return ret;
  }

}
