import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'main-tabs',
    pathMatch: 'full'
  },
  {
    path: 'main-tabs',
    loadChildren: () => import('./pages/main-tabs/main-tabs.module').then( m => m.MainTabsPageModule)
  },
  {
    path: 'scan',
    loadChildren: () => import('./pages/scan/scan.module').then( m => m.ScanPageModule)
  },
  {
    path: 'cloud',
    loadChildren: () => import('./pages/cloud/cloud.module').then( m => m.CloudPageModule)
  },
  {
    path: 'settings',
    loadChildren: () => import('./pages/settings/settings.module').then( m => m.SettingsPageModule)
  },
  {
    path: 'connected-device',
    loadChildren: () => import('./pages/connected-device/connected-device.module').then( m => m.ConnectedDevicePageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
