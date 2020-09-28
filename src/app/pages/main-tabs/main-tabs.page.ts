import { Component, OnInit } from '@angular/core';
import { DeviceService } from 'src/app/services/device-service/device.service';

@Component({
  selector: 'app-main-tabs',
  templateUrl: './main-tabs.page.html',
  styleUrls: ['./main-tabs.page.scss'],
})
export class MainTabsPage implements OnInit {

  constructor(public deviceService: DeviceService) { }

  ngOnInit() {
  }

}
