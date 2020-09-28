import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CloudPage } from './cloud.page';

const routes: Routes = [
  {
    path: '',
    component: CloudPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CloudPageRoutingModule {}
