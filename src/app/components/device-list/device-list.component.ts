import { Component, Input, OnInit } from '@angular/core';
import { DeviceService } from 'src/app/services/device-service/device.service';

@Component({
  selector: 'app-device-list',
  templateUrl: './device-list.component.html',
  styleUrls: ['./device-list.component.scss']
})
export class DeviceListComponent implements OnInit {
  @Input() scanning: boolean;

  constructor(public deviceService: DeviceService) { }

  ngOnInit() {
    
  }

}
