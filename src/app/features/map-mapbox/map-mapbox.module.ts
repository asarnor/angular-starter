import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapMapboxComponent } from './mapbox/map-mapbox.component';

const Components = [MapMapboxComponent];

@NgModule({
  imports: [CommonModule],
  declarations: [Components],
  exports: [Components],
})
export class MapMapboxModule {}
