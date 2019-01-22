import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SiteModule } from '$site'; // Site modules
import { MapboxComponent } from './mapbox.component';
import { MapMapboxModule } from '$features';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { ListingsComponent } from './components/listings/listings.component';
import { ListingComponent } from './components/listing/listing.component';
// import { ListingModalComponent } from './components/listing-modal/listing-modal.component';
import { ModalService } from './services/modals.service';
import { TogglesComponent } from './components/toggles/toggles.component';

const Components = [MapboxComponent, SidebarComponent, ListingsComponent, ListingComponent]; // , ListingModalComponent

@NgModule({
  imports: [CommonModule, SiteModule, MapMapboxModule],
  declarations: [Components, TogglesComponent],
  providers: [ModalService],
  entryComponents: [], // ListingModalComponent
})
export class MapboxModule {}
