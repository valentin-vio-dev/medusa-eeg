import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CloudPageRoutingModule } from './cloud-routing.module';

import { CloudPage } from './cloud.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CloudPageRoutingModule
  ],
  declarations: [CloudPage]
})
export class CloudPageModule {}
