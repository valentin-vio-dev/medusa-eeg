import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Device from 'src/app/models/Device';
import { DeviceService } from 'src/app/services/device-service/device.service';

@Component({
  selector: 'app-connected-device',
  templateUrl: './connected-device.page.html',
  styleUrls: ['./connected-device.page.scss'],
})
export class ConnectedDevicePage implements OnInit {
  loading: boolean;
  device: Device;

  constructor(private router: Router, private route: ActivatedRoute, private deviceSerice: DeviceService) {
   
  }

  ngOnInit() {
    this.loading = true;

    this.route.queryParams.subscribe(params => {
      this.device = this.deviceSerice.getDeviceByAddress(params['deviceAddress']);
      this.loading = false;
    });
  }

  toScanPage() {
    this.router.navigate(['/']);
  }

}
