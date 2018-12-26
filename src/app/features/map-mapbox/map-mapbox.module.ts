import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapMapboxComponent } from './mapbox/map-mapbox.component';
import { MapObjectsService } from './services/map-objects.service';

const Components = [MapMapboxComponent];

@NgModule({
  imports: [CommonModule],
  declarations: [Components],
  providers: [MapObjectsService],
  exports: [Components],
})
export class MapMapboxModule {}
