import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ConnectedDevicePage } from './connected-device.page';

const routes: Routes = [
  {
    path: '',
    component: ConnectedDevicePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConnectedDevicePageRoutingModule {}
