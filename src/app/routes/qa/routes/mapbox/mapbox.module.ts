import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SiteModule } from '$site'; // Site modules
import { MapboxComponent } from './mapbox.component';
import { MapMapboxModule } from '$features';
import { SidebarComponent } from './components/sidebar/sidebar.component';

const Components = [
  MapboxComponent, SidebarComponent
];

@NgModule({
  imports: [
    CommonModule,
    SiteModule,
    MapMapboxModule
  ],
  declarations: [Components]
})
export class MapboxModule { }
