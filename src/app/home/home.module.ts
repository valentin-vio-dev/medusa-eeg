import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';

import { HomePageRoutingModule } from './home-routing.module';
import { DeviceListComponent } from '../components/device-list/device-list.component';
import { DeviceItemComponent } from '../components/device-list/device-item/device-item.component';
import { MedusaChartComponent } from '../components/medusa-chart/medusa-chart.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule
  ],
  declarations: [HomePage, DeviceListComponent, DeviceItemComponent, MedusaChartComponent]
})
export class HomePageModule {}
