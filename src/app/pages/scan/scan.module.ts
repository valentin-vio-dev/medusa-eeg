import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ScanPageRoutingModule } from './scan-routing.module';

import { ScanPage } from './scan.page';
import { DeviceListComponent } from 'src/app/components/device-list/device-list.component';
import { DeviceItemComponent } from 'src/app/components/device-list/device-item/device-item.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ScanPageRoutingModule
  ],
  declarations: [ScanPage, DeviceListComponent, DeviceItemComponent]
})
export class ScanPageModule {}
