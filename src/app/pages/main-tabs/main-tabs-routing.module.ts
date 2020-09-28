import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MainTabsPage } from './main-tabs.page';

const routes: Routes = [
  {
    path: '',
    component: MainTabsPage,
    children: [
      {
        path: 'scan',
        children: [
          {
            path: '',
            loadChildren: () => import('../scan/scan.module').then( m => m.ScanPageModule)
          }
        ]
      },
      {
        path: 'cloud',
        children: [
          {
            path: '',
            loadChildren: () => import('../cloud/cloud.module').then( m => m.CloudPageModule)
          }
        ]
      },
      {
        path: 'settings',
        children: [
          {
            path: '',
            loadChildren: () => import('../settings/settings.module').then( m => m.SettingsPageModule)
          }
        ]
      },
      {
        path: '',
        redirectTo: '/main-tabs/scan',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MainTabsPageRoutingModule {}
