import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SiteModule } from '$site'; // Site modules
import { QaComponent } from './qa.component';
import { routing } from './qa.routes';

import { ChartsComponent } from './routes/charts/charts.component';
import { ChartModule, MapModule, MapMapboxModule } from '$features';
import { MapComponent } from './routes/map/map.component';
import { MapboxComponent } from './routes/mapbox/mapbox.component';

@NgModule({
  imports: [CommonModule, SiteModule, routing, ChartModule, MapModule, MapMapboxModule],
  declarations: [QaComponent, ChartsComponent, MapComponent, MapboxComponent],
})
export class QaModule {}
