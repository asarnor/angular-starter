import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { QaComponent } from './qa.component';
import { ChartsComponent } from './routes/charts/charts.component';
import { MapComponent } from './routes/map/map.component';
import { MapboxComponent } from './routes/mapbox/mapbox.component';

const routes: Routes = [
  {
    path: 'mapbox',
    component: MapboxComponent,
    data: { title: 'Map Box' },
  },
  {
    path: 'map',
    component: MapComponent,
    data: { title: 'Map' },
  },
  {
    path: 'mapbox',
    pathMatch: 'full',
    loadChildren: './routes/mapbox/mapbox.module#MapboxModule',
    canActivate: [],
  },
  {
    path: 'charts',
    component: ChartsComponent,
    data: { title: 'Charts' },
  },
  {
    path: '',
    component: QaComponent,
    data: { title: 'QA Home' },
  },
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
