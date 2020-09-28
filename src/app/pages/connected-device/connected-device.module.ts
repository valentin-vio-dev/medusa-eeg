import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ConnectedDevicePageRoutingModule } from './connected-device-routing.module';

import { ConnectedDevicePage } from './connected-device.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ConnectedDevicePageRoutingModule
  ],
  declarations: [ConnectedDevicePage]
})
export class ConnectedDevicePageModule {}
